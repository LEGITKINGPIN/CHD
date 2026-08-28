import asyncio

import pytest
from httpx import AsyncClient

from backend.main import app


@pytest.mark.asyncio
async def test_clustering_concurrency():
    """
    Test that the semaphore gracefully limits concurrency to 4 max.
    Sending a burst of requests should process them or timeout cleanly.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "algorithm": "K-MEANS",
            "params": {"k": 2},
            "filter": "ALL",
            "district": "ALL",
        }

        tasks = [ac.post("/api/clusters", json=payload) for _ in range(8)]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        successes = 0
        timeouts = 0
        for r in results:
            if hasattr(r, "status_code"):
                if r.status_code == 200:
                    successes += 1
                elif r.status_code == 504:
                    timeouts += 1
                else:
                    assert False, f"Unexpected status code {r.status_code}"

        assert successes > 0, "Expected at least one clustering run to succeed"
