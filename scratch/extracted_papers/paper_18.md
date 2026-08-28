--- Page 1 ---

Received August 20, 2020, accepted August 27, 2020, date of publication September 8, 2020, date of current version September 23, 2020.
Digital Object Identifier 10.1109/ACCESS.2020.3022808
Spatio-Temporal Crime HotSpot Detection and
Prediction: A Systematic Literature Review
UMAIR MUNEER BUTT
1,3, SUKUMAR LETCHMUNAN1, FADRATUL HAFINAZ HASSAN
1,
MUBASHIR ALI
2,3, ANEES BAQIR4, AND HAFIZ HUSNAIN RAZA SHERAZI
5, (Member, IEEE)
1School of Computer Sciences, Universiti Sains Malaysia, George Town 11800, Malaysia
2Department of Management, Information and Production Engineering, University of Bergamo, 24129 Bergamo, Italy
3Department of Computer Science and IT, The University of Lahore, Lahore 54590, Pakistan
4Faculty of Computing and IT, University of Sialkot, Sialkot 51040, Pakistan
5Tyndall National Institute, University College Cork, Cork, T12YT20 Ireland
Corresponding authors: Umair Muneer Butt (umair@student.usm.my), Sukumar Letchmunan (sukumar@usm.my), and Fadratul Haﬁnaz
Hassan (fadratul@usm.my)
This work was supported by the Hubert Curien Partnership France-Malaysia Hibiscus (PHC-Hibiscus) Grant 203.PKOMP.6782005.
ABSTRACT The primary objective of this study is to accumulate, summarize, and evaluate the state-of-
the-art for spatio-temporal crime hotspot detection and prediction techniques by conducting a systematic
literature review (SLR). The authors were unable to ﬁnd a comprehensive study on crime hotspot detection
and prediction while conducting this SLR. Therefore, to the best of author’s knowledge, this study is the
premier attempt to critically analyze the existing literature along with presenting potential challenges faced
by current crime hotspot detection and prediction systems. The SLR is conducted by thoroughly consulting
top ﬁve scientiﬁc databases (such as IEEE, Science Direct, Springer, Scopus, and ACM), and synthesized
49 different studies on crime hotspot detection and prediction after critical review. This study unfolds the
following major aspects: 1) the impact of data mining and machine learning approaches, especially clustering
techniques in crime hotspot detection; 2) the utility of time series analysis techniques and deep learning
techniques in crime trend prediction; 3) the inclusion of spatial and temporal information in crime datasets
making the crime prediction systems more accurate and reliable; 4) the potential challenges faced by the
state-of-the-art techniques and the future research directions. Moreover, the SLR aims to provide a core
foundation for the research on spatio-temporal crime prediction applications while highlighting several
challenges related to the accuracy of crime hotspot detection and prediction applications.
INDEX TERMS Crime patterns, spatio-temporal crime prediction, spatio-temporal HotSpot detection, SLR.
I. INTRODUCTION
Security is an essential aspect of strengthening the roots of a
country. It is the responsibility of law enforcement agencies
of a country to control the crime incidents and crime threats
for the betterment of the society. Crimes can make a signif-
icant impact on the economic growth of a country. There-
fore, countries are spending a substantial amount of their
gross domestic product (GDP) on law enforcement agen-
cies to control crimes [1], [2]. Advancement in technology,
especially Geographical information systems (GIS), assisted
the researchers in presenting numerous crime detection and
prediction techniques.
The associate editor coordinating the review of this manuscript and
approving it for publication was Juan Wang
.
The data of enormous volume being available in the past
few years to have led the scientists with the motivation for
pursuing research in the ﬁeld of crime and criminal investi-
gations. Studying the crime trends and patterns have been the
priority of the law enforcement agencies to make an effective
policy by using the historical data to make a peaceful com-
munity [3], [4]. Based on historical data, forecasting crimes
has been a subject of interest that gained much attention in
research, which resulted in proposing a signiﬁcant number
of different methods for the discovery of different aspects
related to crime prediction [5], [6], and [7].
Crime can be considered as a location-oriented feature as
some places can exhibit greater risk of crime to be committed
than others [8]. It is an understood fact that in a particular area,
no matter the size, crime is not distributed evenly, uniformly,
or even randomly within that area or city [9]. In this regard,
VOLUME 8, 2020
This work is licensed under a Creative Commons Attribution 4.0 License. For more information, see https://creativecommons.org/licenses/by/4.0/
166553

--- Page 2 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
mapping of crime hotspots can help understand the reasons
behind the frequent occurrence of crimes in those areas.
Therefore, the insights and knowledge regarding the mapping
of crimes are of signiﬁcant importance for citizens. Different
types of crimes and the full consideration of the protection
and safety of citizens in any society are signiﬁcant compo-
nents that play a vital role directly in the quality of the lives of
residents. Certain types of criminal incidents such as larceny,
identity theft, or even pick-pocketing can cause disturbance
and stress in an individual’s life and affect his mental peace.
Criminology develops and studies different theories regard-
ing criminal behavior from different perspectives to address
these issues. Numerous types of crimes can occur in an area
with different frequencies. An area may be ﬂagged for higher
pick-pocketing events while the other for a particular type
of crime; hence it is understood from Newyork City (NYC)
crime data1 that the frequency of different types of crimes
is not uniformly distributed. Fig. 1 shows the occurrence of
varying crime types along with the frequency.
FIGURE 1. Frequency distribution of different criminal events in New York
City (NYC).
The inclusion of spatial and temporal information in
the crime datasets using GIS has revolutionized the crime
prediction systems [10]. The spatio-temporal information
helps the researchers to present more reliable and accurate
crime prediction systems. Moreover, time series analysis
techniques such as ARIMA, Moving Averages (MA), and
Exponential Smoothing (ES) performs exceptionally well in
crime forecasting [11], [12]. Besides, deep learning tech-
niques such as CNN and LSTM has also been explored
and found to be useful as compared to state-of-the-art
techniques [13], [14]. However, to strengthen the crime
prediction system, a sufﬁcient amount of data is required.
Researchers around the globe are continuously pursuing dif-
ferent paradigms such as transfer learning to improve the
crime prediction accuracy [15] signiﬁcantly.
In the literature, many researchers have investigated the
use of machine learning and time series analysis tech-
niques to assure the accuracy and reliability of crime pre-
diction systems [12]. Some papers have emphasized on the
1https://data.cityofnewyork.us/Public-Safety/NYPD-Complaint-Data-
Historic/qgea-i56i/data
signiﬁcance of spatial and temporal information to ﬁnd
irregularities in crime [16], [17]. Shamsuddin et al. [18]
presented the ﬁrst comprehensive overview of prediction
methods used for crime prediction. Notably, they focus
on the clustering, time series analysis, and deep learning
approaches. Besides, the majority of researchers survey data
mining and machine learning techniques for crime detection
and prediction [19]–[22]. Kapoor et al. [23] present analysis
of crime dataset and enlighten on the essential features such
as spatial and temporal features. Helbich and Leitner [24]
published an editorial on the practical signiﬁcance of spa-
tial and Spatio-temporal information for crime analytics.
Although the authors presented different survey papers on
crime analysis, the main focus has been on exploring the use
of data mining techniques.
Furthermore, only a single author has focused on the crime
dataset, which is one of the fundamental element in crime
prediction system. Besides, the literature on crime prediction
techniques and challenges is still scattered that obstruct the
innovation of advance technologies and new ideas for crime
prediction. Therefore, a systematic analysis of crime detec-
tion and prediction is inevitable. In this article, we provide a
comprehensive literature review of data mining and machine
learning approaches and spatio-temporal datasets, potential
challenges faced by existing literature, and proposed potential
research areas. In summary, the signiﬁcant contribution and
why SLR is necessary is presented in the following sections:
A. PROBLEM STATEMENT
Crime hotspot identiﬁcation and prediction is an essen-
tial area of research to oversee criminal activities for the
law and enforcement agencies. A vast amount of literature
has been cited to identify and predict criminal hotspots in
Spatio-temporal context. However, it is difﬁcult to review the
available shreds of evidence based on traditional literature.
The scattered research produced and cited motivated the need
for a systematic literature review (SLR) on Spatio-temporal
crime hotspot identiﬁcation and predicting.
The aim is to systematically review and report the available
pieces of evidence in the current literature to support the
proposed research questions. This research organizes and
sums up the crime detection and prediction techniques along
with the superior techniques among them. This study will also
present potential challenges and research gaps that will help
the researchers and beginners in this area.
B. RESEARCH CONTRIBUTIONS
Numerous contributions have been made in the area of crime
hotspot detection and prediction. However, there is a shortage
of a comprehensive and systematic literature review that can
organize and summarize the signiﬁcant existing pieces of
evidence, potential challenges faced by them, and present
the unmet needs. This SLR aims to cover literature from
Jan 2010 to December 2019. The primary contributions of
this systematic study are to answer the following research
questions:
166554
VOLUME 8, 2020

--- Page 3 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
1) RQ1: What empirical evidence of the beneﬁts and lim-
itations of data mining/machine learning approaches
currently exist to support the effectiveness of different
hotspot detection techniques?
2) RQ2: What data mining/machine learning approaches
currently exist to support the effectiveness of different
Spatio-temporal hotspot prediction techniques?
3) RQ3: What are the potential challenges highlighted in
existing studies to build a robust Spatio-temporal crime
prediction model?
4) RQ4: What are the critical characteristics of the
datasets used in this study? Do their features seem to
affect the results?
The methodology of this SLR is inspired by the guidelines
provided by Kitchenham and Charters [25] and weidt and
Silva [26]. These guidelines are widely used in literature
for conducting SLR [27]–[30]. The SLR is organized as;
section II focuses on the state-of-the-art techniques and real
world crime prediction approaches, section III discusses the
overall methodology, section III-E, and III-F followed the
research process guidelines by formulating research ques-
tions, study selection, and quality assessment, respectively.
Results and discussion are comprehensively presented in
section IV, followed by a detailed analysis in section V. The
paper concludes with future directions in section VI.
II. RELATED WORK
In this SLR, we searched IEEE, ACM, Springer, Scopus, and
Science Direct using the search string ((Spatio OR Spatial
OR Spatio-temporal OR Temporal OR Spatial and Temporal)
AND (Crime OR Violation) AND (hotspot OR Dense) AND
(Identiﬁcation OR Detection OR Forecasting OR Prediction)
AND (Data mining OR Machine learning)). After an in-depth
review, we could not ﬁnd any SLR during 2010-2019 that
focuses on crime hotspot detection and prediction. However,
accuracy issues are prevailing in crime hotspot detection, and
prediction [31]–[33], and the signiﬁcance of crime prediction
has urged the researchers to contribute to this area. In the fol-
lowing, we ﬁrst focus on the state-of-the-art techniques, and
then real-world crime prediction applications are presented.
Besides, we found 30 signiﬁcant state-of-the-art studies
that discussed the spatio-temporal crime hotspot detection
and prediction. Table 1 lists down the surveys, editorial,
comparative studies, and mapping studies on a similar area.
There are seventeen surveys, two editorials, three compar-
ative studies, and eight mapping studies found during the
search process. Out of thirty studies, nine studies focused on
crime prediction, nine discussed spatio-temporal crime, six
analyze hotspot detection, and six studies enlightened crime
mapping signiﬁcance. The studies are classiﬁed into four
broad categories based on their focus, including crime predic-
tion, spatio-temporal crime analysis, crime hotspot detection,
and crime mapping.
In recent years, machine learning and data mining play
an essential role in crime analysis, detection, and predic-
tion. Several studies have been proposed using data mining
techniques for solving real-world problems. Predictive min-
ing is one of the most commonly used systematic approaches
for predicting such as crime, criminal behaviour, and intru-
sion detection. Nine studies found that used data mining
techniques for crime prediction such as classiﬁcation, asso-
ciation role mining, ensemble approaches, and classic
machine learning techniques [18], [19], [22], [34]–[36], [49].
Yu et al. [37] explored the deep learning models such as
Recurrent and Convolutional Neural Network for crime pre-
diction due to their promising performance in other ﬁelds.
They introduced a pipeline to use deep learning models with
spatio-temporal data mining techniques. Jiang et al. [50]
provide a systematic method to use spatial methods for
prediction with underlying assumptions, advantages, and
disadvantages.
The evolution of GIS and the inclusion of spatial and tem-
poral information led the researchers to propose more robust
algorithms for applications such as crime analysis, tracking,
dense region speciﬁcation, and future predictions. Leong and
Sung [38] discussed state-of-the-art spatio-temporal crime
analysis techniques. They emphasize on the various factor
of spatial and temporal data that a crime analyst should
consider while analyzing the situation. Again, data mining
approaches are considered vital for crime analysis [20], [46],
[47], [52]. They discussed predictive policing using analytical
and predicting to identify criminals. A few papers used data
mining approaches like K-mean, Density-based clustering,
and association mining to identify certain patterns for crime
such as robbery and suicides. Kapoor et al. [23] presented
a short survey on crime data using formal concept analy-
sis. Particularly, they focus on crimes in India. Helbich and
Leitner [24] published an editorial on the spatio-temporal
crime analytics primarily focus on the current trends and
unmet needs. Several studies have used spatio-temporal crime
analysis for violent crime, residential burglary, and vehicle
theft [51], [53].
Recently, spatio-temporal information has been widely
used with data mining, and machine learning approaches
for crime dense region detection [21], [40], [55]. The pro-
posed studies used data mining techniques to develop new
strategies for law enforcement agencies to control crime.
Juan et al. [39]summarized the spatio-temporal methods that
focus on the distribution of crime hotspots and predict its
future occurrence. Zeng et al. [48] present a comparative
study to evaluate the effectiveness of two state-of-the-art
spatio-temporal hotspot detection techniques such as scan
statistics and risk-adjusted clustering. Deep learning has also
been used in crime dense region detection due to its per-
formance and accuracy. Nair and Gopi [54] explored deep
learning techniques and found usefull as compared to several
data mining techniques.
To visualize, analyze, and track crime or criminal activ-
ities, crime mapping is an essential area of research for
crime analysts. Crime mapping helps the analyst to identify
dense crime regions, trends, and patterns. Data mining tech-
niques have also been used for crime mapping, along with
VOLUME 8, 2020
166555

--- Page 4 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
TABLE 1. Classification of related studies in term of different categories of crime hotspot detection/prevention.
GIS [41], [44], [57]. Zhou et al. [42]present a web-based
GIS to map crime hotspots. They proposed a web-based
prototype and hypothesized that web-based crime mapping,
decision support systems, and reliable internet connectivity
could perform well as compare to the traditional system.
Mazerolle et al. [56] present the challenges faced by a police
department in crime mapping. Ratcliffe [43] discuss the ben-
eﬁts of spatio-temporal crime mapping and different ways to
identify dense crime regions.
The scope of existing literature is signiﬁcant and covers a
notable amount of academic research in the spatio-temporal
crime hotspot detection and prediction area. However, they
are limited in terms of thoroughness, detailed insight, and
organization. Our study is the ﬁrst systematic literature
review on spatio-temporal crime hotspot detection and pre-
diction. Primarily, it aims to present recent advancements
in crime hotspot detection and prediction. Furthermore,
it provides preeminent crime detection and prediction tech-
niques, along with performance measures used in each
area. Moreover, this study organizes and summarizes state-
of-the-art spatio-temporal crime datasets that are publicly
available.
The table 1 classiﬁes the related studies in the broad
domain of spatio-temporal crime hotspot detection and pre-
diction into different categories. It is evident from the table
that the proposed study covers almost all essential aspects
of spatio-temporal crime hotspot detection and prediction.
Furthermore, the potential challenges faced by state-of-the-
art studies are highlighted and future research directions are
discussed.
III. RESEARCH METHOD
A wide range of literature has been reported for crime hotspot
detection and prediction. The primary objective is to inves-
tigate which methods are superior as compared to others in
Spatio-temporal crime hotspot identiﬁcation and predicting.
One crucial point is to study the impact of Spatio-temporal
datasets as compared to other datasets presented in the lit-
erature for crime hotspot identiﬁcation and predicting. The
other important thing in this SLR is to present potential
challenges faced by the proposed techniques in literature that
can make a crime identiﬁcation and predicting algorithm
more robust. To the best of the author’s knowledge, this SLR
166556
VOLUME 8, 2020

--- Page 5 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
on crime hotspot detection and prediction is a ﬁrst attempt
from 2010-2019.
This SLR is performed using the guidelines provided
by [25]. It is stated in the instruction that; an SLR deﬁned
as planning, evaluation, and reporting the available research
relevant to a particular research area, question, topic, or ﬁeld
of interest. The motivation for performing such a review is
to identify the existing approaches regarding the use of a
particular technology, to determine the potential challenges
and gaps in the current research and a direction for properly
conducting new research in this direction [26]. Almost all
the literature on SLR suggests that it consists of three stages:
planning, conducting, and reporting the review. Kitchenham
and Charters [25] proposed a more reﬁned form of these steps
as follows:
1) Deﬁne the research questions.
2) Identify a few relevant studies and perform a pilot
study.
3) Search data on the relevant databases (IEEE, Springer,
ACM, Science Direct).
4) Document the search strategy
5) Appraisal and selection of studies.
6) Analyzing and presenting the results.
7) Discuss the generalized conclusion and limitations of
the review.
8) Make recommendations
The overall objective of the planned SLR is to analyze
and summarize the results to date on Spatio-temporal hotspot
identiﬁcation and prediction and to ﬁnd the potential gap and
opportunities for future research directions in this area.
A. RESEARCH QUESTIONS
It is essential to ﬁnd the right research questions to interpret
the state-of-the-art Spatio-temporal crime hotspot identiﬁca-
tion and predicting empiric research. The primary motivation
behind this SLR is to identify the current tendency and factors
that can impact the identiﬁcation and prediction of crime
hotspots. The research questions are structured and prepared
based on the [25] criteria population, intervention, outcome,
and context (PIOC).
In context with the criteria mentioned in Table 2 following
research questions need to be addressed in this SLR:
TABLE 2. Criteria for research questions.
1) RQ1: What empirical evidence of the beneﬁts and lim-
itations of data mining/machine learning approaches
currently exist to support the effectiveness of different
hotspot detection techniques?
a) RQ1a: What techniques have been reported for
the detection of Crime Hotspots?
b) RQ1b: What detection approaches are reported to
be superior for crime hotspot detection based on
empirical evidence?
c) RQ1c: What performance measures have been
taken for measuring the accuracy of detection of
Crime Hotspots?
2) RQ2: What data mining/machine learning approaches
currently exist to support the effectiveness of different
Spatio-temporal hotspot prediction techniques?
a) RQ2a: What techniques have been reported
for the Prediction of Spatio-temporal Crime
Hotspots?
b) RQ2b: What Spatio-temporal prediction appro-
aches are reported to be superior for crime hotspot
detection based on empirical evidence?
c) RQ2c: What performance measures have been
taken for measuring the accuracy of Spatio-
temporal prediction of Crime Hotspots?
3) RQ3: What are the potential challenges highlighted in
existing studies to build a robust Spatio-temporal crime
prediction model?
4) RQ4: What are the critical characteristics of the
datasets used in this study? Do their features seem to
affect the results?
a) RQ4a: Which type of dataset has been used for
this research (Professional or self-acquired)?
b) RQ4b: What are the main aspects of a dataset for
the Spatio-temporal crime hotspot? Do they affect
results?
Usually, the SLR’s presented in literature follow planning,
evaluating, and reporting as signiﬁcant steps which itself con-
sists of several substeps. In this SLR, the aim is to follow the
mechanism provided by [25], and they proposed to start SLR
with a pilot study to check the feasibility and appropriateness
of research questions and to explore the viability of gather-
ing and analyzing the data to answer the proposed research
questions. We followed the process by an initial pilot study
on a set of papers to check the appropriateness of proposed
research questions. Did the included articles have essential
data to answer the research questions and the feasibility of
the proposed analysis? Based on this insight, the plan was
polished, and a full through SLR on the Spatio-temporal
crime hotspot identiﬁcation and predicting is performed.
B. SEARCH STRATEGY
A well-planned search strategy is fundamental in an SLR to
extract relevant research work from the search results. There-
fore, a substantial search for the research paper was con-
ducted to answer the proposed research questions. We used
VOLUME 8, 2020
166557

--- Page 6 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
the steps recommended by [58] to prepare the search terms
used in this SLR:
1) Derive signiﬁcant search terms from the research ques-
tions by identifying population, intervention, outcome,
and context.
2) Enlist the keywords in the relevant papers.
3) Point out alternative spellings and synonyms for search
terms with the help of a dictionary.
4) Use Boolean AND to concatenate the search keywords
for conﬁned research.
5) Use OR to construct search keyword from search terms
with similar meanings.
C. SEARCH STRING
The resultant search strings are as follows:
SPATIO: ‘‘Spatial’’OR ‘‘Dimensional’’ OR ‘‘Geographi-
cal’’ OR ‘‘Contiguous’’ OR ‘‘Structural’’ AND
TEMPORAL: ‘‘Earthly’’ OR ‘‘Materialistic’’ OR ‘‘Physi-
cal’’ OR ‘‘Sensual’’ AND
CRIME: ‘‘Atrocity’’ OR ‘‘Breach’’ OR ‘‘Case’’ OR ‘‘Cor-
ruption’’ OR ‘‘Evil’’ OR ‘‘Felony’’ OR ‘‘Infraction’’ OR
‘‘Lawlessness’’ OR ‘‘Misconduct’’ OR ‘‘Misdeed’’ OR
‘‘Scandal’’ OR ‘‘Violation’’ OR ‘‘Wrongdoing’’ AND
HOTSPOT: ‘‘Intense’’ OR ‘‘Dense’’ AND
DETECTION: ‘‘Observation’’ OR ‘‘Noticing’’ OR ‘‘Iden-
tiﬁcation’’ OR ‘‘Spotting’’ OR ‘‘Recognition’’ OR ‘‘Diag-
nosis’’ OR ‘‘Sensing’’ AND
PREDICTION: ‘‘Forecasting’’ OR ‘‘Prophecy’’ OR ‘‘ Div-
ination’’ OR ‘‘Augury’’ OR ‘‘Projection’’ OR ‘‘Prognosis’’
OR ‘‘Guess’’
These search strings are included to ﬁnd relevant papers
from the literature. Some terms are confusing, as shown
in Table 3 but we added them to maximize the consistent
search outcome. However, the studies will be excluded from
the study selection stage if it is not related to crime hotspot
detection and prediction.
TABLE 3. Keyword synonyms.
The search strategy comprised of the following decisions:
We used a custom range of Publication period from 2010 to
December 2019 as that is the time literature performed. Hence
any paper published after December 2019 is not included in
this study, as shown in Table 4.
TABLE 4. Search strategy decisions.
D. STRING REFINEMENT
Once the string is formed, it is crucial to validate the search
results returned from deﬁned search engines. Potential papers
for primary study should appear in the result. If no known
paper appears, or very few returned, the search string must be
calibrated. To reﬁne the search string, we must have to reﬁne
our synonyms identiﬁed as well as the search criteria in each
search engine.
We have to check the effect of inclusion and exclusion of
synonyms, publication type, year limit, language, research
area, and speciﬁc journals, etc., on individual bases until
satisﬁed with the results. The search string evolution process
for this SLR is shown in Fig. 2. Table 5 shows the paper
returned after various limits applied with the ﬁnal search
string to the searched databases.
TABLE 5. Search limits on searched databases.
There are certain limits individually applied, and some
limits are commonly applied to a search engine like; English
Language, year (2010-2019), article type (conference, jour-
nal, magazine, and workshop). IEEE Explorer returned very
166558
VOLUME 8, 2020

--- Page 7 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
FIGURE 2. Search query evolution process.
few results as compared to other search databases through-
out the query evolution process. For Springer, we further
limit the search by selecting journal names (Data mining
and Knowledge Discovery) from suggested journals, which
results in ﬁne-tuned papers. ACM results improved a lot after
limiting content type PDF with all the conventional limits.
Science Direct has a speciﬁc limitation that search does not
support more than 8 Boolean connectors per ﬁeld; therefore,
we could not ﬁnd any papers. Later, we calibrated the search
with the addition of journal name (Applied Geography) and
publication title. Lastly, the Scopus search engine is used with
articles, and conference papers limit resulted in 19 papers.
The resultant ﬁnal paper distribution in every search engine
is shown in Fig.4.
E. STUDY SELECTION
The composed search strategy resulted in 375 candidate
papers, as shown in Fig. 5. We excluded the research papers
based on three widely used selection criteria: Title and
Abstract based Analysis, Introduction and Conclusion Based
Analysis, and Full paper and Quality Assessment based anal-
ysis. In the ﬁrst phase, 124 papers were excluded based on
title and abstract analysis. Leftover, 251 papers further ana-
lyzed by reading the introduction and conclusion part of the
paper. During the second phase, 107 papers were eliminated
from the candidate papers. Remaining 144 papers examined
in the ﬁnal phase, based on full text, quality assessment
criteria, and by critically evaluating the signiﬁcance of work,
95 papers were excluded, and 49 papers left as candidate
papers for this SLR. The frequency distribution of papers
selected over the years is shown in Fig.3.
FIGURE 3. Year wise distribution of selected studies.
1) INCLUSION CRITERIA
1) The study focus on the detection of crime hotspot
2) The study focus on the prediction of crime hotspot
3) Current practices for crime prediction by law and
enforcement agencies
4) Among duplicate publications of the same study,
the most thoroughgoing and recent included.
2) EXCLUSION CRITERIA
1) Secondary studies (e.g. systematic literature, survey)
2) Studies that are written in a language other than English
3) Studies that have not been peer reviewed
4) Studies that are not available in full-text
5) Later than Jan, 2010
VOLUME 8, 2020
166559

--- Page 8 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
FIGURE 4. Article type distribution in searched databases.
To answer the research questions, all the studies that iden-
tiﬁed in this SLR, read comprehensively, and thoroughly to
produce the data needed to answer. It would be appropriate
to organize all the extracted information in a Table that origi-
nated from the SLR. The assembled data can then highlighted
in different colors according to various research questions,
as shown in Fig. 6. This technique will help the researcher
to keep track, detect, and validate the required information
timely.
F. QUALITY ASSESSMENT
In this SLR, a checklist of quality assessment (QA) is cus-
tomized for the evaluation of individual studies based on
guidelines provided by [26] and [25]. In the literature, sev-
eral studies [64], [65], and [66] have customized the quality
assessment criteria based on the guidelines provided in [25].
We used a three-point scale method for the Quality assess-
ment checklist, as shown in Table 6. If the point is present
(P), it will add one to the score; in case of absence (A),
it will be zero, and if the study is sufﬁcient (S), it will be 0.5.
There is a maximum of 12 points a study can achieve based
on the number of QA questions. We chose the ﬁrst quartile
(12/3 = 4) as an inclusion number for this SLR. If an inves-
tigation cannot score higher than 4, it would be discarded,
as shown in Table 7.
1) THREATS TO VALIDITY
This SLR may suffer from validity threats. We should con-
sider these threats while analyzing and reporting our ﬁndings.
We have excluded the paper from our prime study that does
not have a spatial-temporal and crime hotspot in their titles.
So, we may have overlooked several studies that are associ-
ated with Spatial-temporal crime prediction, but they have not
mentioned these terms in the title.
FIGURE 5. Summary of search process.
FIGURE 6. A way of organizing SLR data in a Table for better
understanding.
TABLE 6. Customized quality assessment criteria adopted from [25], [64].
Studies are also excluded due to the lack of scientiﬁc
thoroughness. A substantial number of literature reported
by new beginners in academia and industry may lie in this
category. It was analyzed during the pilot study, and while
deﬁning inclusion and exclusion criteria that comparison with
166560
VOLUME 8, 2020

--- Page 9 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
TABLE 7. Quality assessment criteria of scoring the papers.
the state-of-the-art is missing in all aspects. It is beneﬁcial to
collate with the research and academia to make a substantial
scientiﬁc contribution.
One primary concern in research is to explore pub-
licly available datasets. A detailed description and ori-
gin of the majority of the crime dataset are found miss-
ing in the literature due to its sensitivity. These datasets
may be referred to as ‘‘grey literature’’ such as a sci-
entiﬁc report. So this may result in a dissatisfaction that
SLR fails to cite such valuable datasets and their scientiﬁc
contribution.
2) VALIDATION OF SYSTEMATIC LITERATURE REVIEW
The validation of this SLR is performed by following the
guidelines provided by Kitchenham and Charters [25]. Only
a couple of studies duly follow all the SLR steps. The only
articles are considered where the mutual consensus is reached
by both the researchers by following an inclusion/exclusion
criteria. The rest of the researchers mainly contributed to
the planning and development protocol, working primarily as
supervisors. Moreover, the validation involves ﬁne-tuning of
the search query and searches query process, and the priority
is given to the most cited literature.
VOLUME 8, 2020
166561

--- Page 10 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
The query reﬁnement process is crucial to ensure that the
returned papers are relevant and aligned with the deﬁned
research questions. The search query reﬁnement process is
shown in Fig. 2 and calibrations are performed until the
required literature is returned. It was revealed during the
study selection process that some studies are duplicated; they
were ﬁrst included in the conference proceedings [105] and
then were published by a journal as extended versions [112].
Furthermore, quality assessment criteria III-F are deﬁned by
following the guidelines provided in [25], [26].
IV. RESULT AND DISCUSSION
The result and ﬁndings are presented in this section
extracted
from
the
reviewed
papers
to
answer
the
research questions. All the research questions are answered
according
to
the
relevant
studies
highlighted
during
the SLR.
A. SPATIO-TEMPORAL CRIME HOTSPOT DETECTION
TECHNIQUES (RQ1a)
There are 11 techniques extracted from the studies reported
for Spatio-temporal crime hotspot detection. These are as
follows:
• PCA
• GD Patterns
• TCP
• FP-Growth
• LIBSVM
• CCRBoost
• MLP
• Random Forest, Naïve Bayes, J48, Decision Tree
• SANET+Kernel Density Function
• Fuzzy C-Mean
• DBSCAN
In this review, we classiﬁed the ensemble-based approach
Random forest and Naïve Bayes, J48, and decision trees
in the same category. Random forest normally operates on
constructing decision trees and can be used for classiﬁca-
tion. The trending deep learning-based methods have also
been used for hotspot detection and are comparable in per-
formance with traditional state-of-the-art classiﬁcation tech-
niques. Classiﬁcation techniques used less as compared to
clustering, as shown in Fig. 7, along with the ensemble
approaches for hotspot detection. Clustering approaches are
also extensively used in the literature from the past few years,
as shown in Table 8.
Clustering approaches are comparable in performance with
the classiﬁcation and ensemble approaches. From the last
few years with the increasing usage of Spatio-temporal infor-
mation in datasets clustering approaches performs relatively
well in hotspot detection. Speciﬁcally, Density-Based Spa-
tial Clustering of Applications with Noise (DBSCAN) is a
density-based unsupervised clustering approach that has been
reported recently with comparable performance in hotspot
detection [105].
FIGURE 7. (%) Distribution of crime hotspot detection approaches.
1) SUPERIOR SPATIO-TEMPORAL CRIME HOTSPOT
DETECTION APPROACHES (RQ1B)
The primary objective of this SLR is to provide ease for
beginners who want to contribute to Spatio-temporal crime
prediction. Most researchers and beginners would like to
know the most prominent techniques that have been reported
so far for crime hotspot detection. In this section, we discuss
some outstanding approaches so far reported; however, it is
difﬁcult to answer precisely because every study has its con-
text of hotspot detection.
A few superior and prominent techniques for Spatio-
temporal crime hotspot detection have been identiﬁed in
the literature in terms of the best technique of paper, sug-
gestions, and future work. The preeminent techniques that
are compared with state-of-the-art in a particular study are
shown in Table 9. As mentioned earlier, some researchers
have mentioned the best technique among the ones they
implemented and compared. However, they are according to
the dataset being used, performance measures being used, and
in a particular scope.
In this SLR, during the pilot study and after a thorough
review of literature shortlisted, mixed results are identiﬁed
as they are in a particular setting, which is different in oth-
ers. The majority of the literature does not have a dataset
description and not even any link to access and compare
results, so it is hard to conclude the prominent approaches
they have mentioned. A few papers use [5], [71], [105], [112]
same publically available crime data and compare their
results in a particular setting. However, researchers such as
Kadar et al. [104] and Rumi [100] use different datasets to
check the effectiveness of their proposed approach.
Catlett et al. [105] discuss the potential challenges faced
by the researchers in obtaining crime data from the criminal
investigation department of different countries. There are
few studies recently reported that uses spatial and tempo-
ral information from the datasets for crime prediction. The
majority of reported datasets do not have space and time
information, so it is challenging to compare techniques based
on this fact that crime detection approaches improve a lot
166562
VOLUME 8, 2020

--- Page 11 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
TABLE 8. Spatio-temporal crime hotspot detection techniques.
after the usage of Spatio-temporal information. Spatial and
temporal information addition in datasets found to be more
effective for crime prediction. Catlett et al. [112] pointed out
the DBSCAN approach to be superior among all the crime
detection approaches as they compared with state-of-the-art
techniques. They used publically available Chicago crime
dataset that is used in many crime hotspot detection papers.
They also suggested using a hierarchal clustering algorithm
instead of DBSCAN.
The detailed comparison of crime hotspot techniques is
presented in Table 9. It can be seen from the Table that
clustering approaches are most widely used in the litera-
ture. Among them, DBSCAN found to be more reliable
and effective as compared to state-of-the-art techniques.
Apart from that, classiﬁcation and ensemble approach MLP,
Naïve Bayes, SVM, and Random Forest are also reported
in higher numbers and found to be useful. Among them,
Random Forest is quite effective mentioned by a few
papers.
With the increasing usage of spatial and temporal infor-
mation, clustering becomes more effective, as shown in the
Table 9. Catlett et al. [105] use DBSCAN to predict crime
hotspot and evaluate on a publicaly available Chicago crime
dataset. DBSCAN found to be outstanding as compared to
other state-of-the-art approaches. The primary reason behind
their work is that they evaluate their proposed approach in
Chicago as well as other datasets that are also commonly used
in the past. However, they also discuss the shortcomings of
DBSCAN and suggest to use hierarchical clustering instead.
So still a research gap exists that needs to be addressed in the
future.
TABLE 9. Superior crime hotspot detection techniques.
2) PERFORMANCE MEASURES FOR SPATIO-TEMPORAL
CRIME HOTSPOT DETECTION TECHNIQUES (RQ1C)
Several methods have been used in the literature to evaluate
the performance of a Spatio-temporal crime hotspot detection
VOLUME 8, 2020
166563

--- Page 12 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
technique. As, various approaches have been reported to
detect the dense crime regions such as; Clustering, Classiﬁca-
tion, Frequent pattern mining, Ensemble, Deep Learning, etc.
Therefore, different performance measures have been chosen
based on the approach. It is vital to gather all the information
about the performance measure that is widely used and found
to be effective.
During the SLR study, it was found that Accuracy, Root
Mean Square Error (RMSE), and F1_score are commonly
used in the literature for various approaches. For frequent
pattern mining, min-support and conﬁdence measures are
reported frequently. Apart from that, standard deviation, Vari-
ance, mean, and correlation measures have also been used.
From Table 10, it is evident that the accuracy measure is
used in 45% of the studies. Support and conﬁdence measure
is used in numerous pattern matching techniques and reported
around 20% of the studies. ROC curve, F1_score, and Kappa
Index Measure have also been reported. So, from the above
examination, it is concluded that Accuracy measures, espe-
cially sensitivity and speciﬁcity, are commonly used in liter-
ature for different evaluation kinds of crime hotspot detection
techniques; however, some performance measures are spe-
ciﬁc for a particular approach like Support and conﬁdence.
TABLE 10. Evaluation measures reported for crime hotspot detection.
B. SPATIO-TEMPORAL CRIME PREDICTION
TECHNIQUES (RQ2A)
Several techniques have been reported for Spatio-temporal
crime forecasting. For this SLR, we have classiﬁed them
into six different categories: Deep learning-based, Classical
Classiﬁcation approaches, Statistical, Time series analysis,
Regression Techniques, and clustering techniques. Classiﬁ-
cation approaches are reported in the majority, around 50% of
total approaches, as shown in Fig. 8. We further divided them
into classical and deep learning-based, as shown in Table 11.
FIGURE 8. (%) Distribution crime prediction approaches.
• MLP, NN, GA-BP Neural Network, DNN, CNN,
Spatio-temporal Neural Network
• Random Forest, Naïve Bayes, J48, Decision Tree,
K-NN, Classiﬁcation and Regression tree, SVM,
LIBSVM, M5P
• SANET+Kernel Density Function, Temporal Correla-
tion prediction framework, GD Patterns-Hotspot Opti-
mization Tool, Spatio-temporal Generalized Additive
Model, Spatio-temporal Ordinary Kriging
• ARIMA
• Ridge Regression, Lasso Regression
• Fuzzy C-Mean, DBSCAN, Clustered CCRF, Cluster
Conﬁdence Rate Boosting (CCRF), K-mean
Researchers attempted different kinds of approaches like
regression approaches and some Spatio-temporal models
based on statistics. They are around 12% of the total
approaches. Among all, Clustering approaches have also been
reported extensively and found to be useful as compare to
classiﬁcation approaches, particularly DBSCAN and Fuzzy
C-Mean are reported recently with the comparable perfor-
mance [96].
In 2017, the United States Department of the national insti-
tute of justice hosted a real-time crime forecasting challenge
to address the challenges of crime and criminal justice [126].
This competition aimed to develop crime prediction algo-
rithms to improve knowledge, understanding of crime, and to
reduce crime before it takes place. The challenges consist of
three categories, students, small businesses, and large busi-
nesses. Four crime types are addressed, such as residential
burglary, commercial burglary, street crime, and vehicle theft.
Portland police bureau provided the Call-For-Service (CFS)
data of their jurisdiction from March 2012 to February 2017.
Sixty-two algorithms were submitted by the data scien-
tist. Top 4 contestants were students, 19 were from small
business units and ten algorithms from the large business.
Mohler et al. [120] Mohler and Porter [127] proposed a novel
method that selects an optimal grid size, orientation, and
a scoring function that maximizes the Predictive Accuracy
Index (PAI). Lee et al. [121] use population heterogeneity
theory to ﬁnd areas of consistent crime and state dependency
theory to address short term risk in certain places.
166564
VOLUME 8, 2020

--- Page 13 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
TABLE 11. Spatio-temporal crime prediction techniques.
Al Boni and Gerber [122] proposed a novel method
for hotspot analysis with a hybrid of the localized ker-
nel density function and evolutionary algorithms. They
also explore the effect of data sparsity on the perfor-
mance of these models. Koontz [123] use Probability
Density Function (PDF) with kernel smoothing function to
measure the PDF of historical data and use these prob-
abilities to forecast the crime area. Ledray et al. [124]
used open-source geospatial software (OpenJump) for past
data crime mapping and used the C library to mark
VOLUME 8, 2020
166565

--- Page 14 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
hotspots. After that, they used data mining approaches for
forecasting.
Recently, Time series analysis techniques have been intro-
duced for crime forecasting [105] as clustering and classiﬁca-
tion approaches fail to provide promising results in this area.
These challenges are addressed by introducing Time series
analysis techniques called Auto Regressive Moving Aver-
age (ARMA) techniques in crime forecasting. A generalized
model of ARMA called Auto Regressive Integrated Mov-
ing Averages (ARIMA) has been reported recently and out-
performed as compared to state-of-the-art techniques [112].
It has been found that ARIMA models have some shortcom-
ing which needs to be addressed and a research gap still exist
in this area for future researchers.
1) SUPERIOR SPATIO-TEMPORAL CRIME PREDICTION
APPROACHES (RQ2B)
Crime hotspot detection and forecasting is an essential area of
research due to the rapid increase in urbanization. The major
shift is causing several challenges for law enforcement agen-
cies to manage services and providing safety. Mainly, cities
with highly populated areas the risk of crime can increase.
Over the last few years, several efforts have been made in the
area of crime forecasting [91], [99], [116]. This question aims
to present the most promising techniques reporting so far.
Existing approaches for crime forecasting are divided
into six different categories: Classical classiﬁcation, deep
learning-based, Clustering, Framework proposed, Regression
techniques, and Time series analysis. Around 50% reported
techniques for crime forecasting are standard classiﬁcation,
as shown in Fig. 8.
The detailed explanation, the dataset used, the com-
parison made, and the most promising technique reported
in each study are presented in Table 12. From classical
classiﬁcation approaches mentioned above, random forest,
hyper-ensemble, and M5P algorithm found to be supe-
rior as compared to other approaches. Deep learning-based
approaches are reported extensively with the addition
of Spatial and temporal information like Neural net-
work (NN), Genetic algorithm with back propagation NN,
Spatio-temporal NN based on LSTM, ST-ResNet, and
Spatio-temporal CNN. Researchers have also attempted
statistic and probability-based models as Spatio-temporal
Ordinary Kriging, Linear discriminant analysis with K-NN,
and Spatio-temporal generalized additive model.
Regression techniques have also been reported, like
ridge regression and Support vector regressor. Cluster-
ing approaches constituted 40% of the total approaches
and found to be promising. The clustering-based Supe-
rior approaches are also presented with some modiﬁca-
tions like; DBSCAN, Cluster-Conﬁdence Rate-Boosting
(CCRBoost), Spatio-temporal Extended Fuzzy C-Means
(SEFCM), and Clustered Continuous Conditional Random
Field (Clustered-CCRF). One key aspect that is missing in
all these approaches is the comparison with state-of-the-art
techniques. The majority of the techniques failed to report
TABLE 12. Superior crime hotspot prediction techniques.
a robust comparison with prominent techniques presented
so far.
Recently time series analysis techniques have been pre-
sented [112], and it is evident that they outperformed as
compared to state-of-the-art techniques. Particularly, ARIMA
has been used for crime forecasting as it works best where
the data have repeated patterns and trends. One drawback
of ARIMA is that it cannot handle non-stationary data and
takes much time in calculation. Crimes can be seasonal that
may occur in a speciﬁc period and repeat that. So a research
gap still exists to consider the seasonal element in crime
forecasting and demographic factor that can affect crime.
2) PERFORMANCE MEASURES FOR SPATIO-TEMPORAL
CRIME PREDICTION TECHNIQUES (RQ2C)
Six different categories of Machine learning and data mining
approaches have been used in literature for Spatio-temporal
166566
VOLUME 8, 2020

--- Page 15 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
crime prediction, as mentioned above. Some studies have
not mentioned any performance measure, and they also have
not compared their proposed work with state-of-the-art tech-
niques. It is hard to nominate one performance for crime
hotspot detection because every technique has its context.
It is evident from the Table 13 that Accuracy and Root
Mean Square Error (RMSE) are used widely for performance
evaluation. The second performance measure is F1_score
which is mainly used to evaluate classiﬁcation algorithms.
Precision, Recall, Sensitivity, and speciﬁcity also have been
used for model evaluation. The Area Under the Curve (AUC)
used in classiﬁcation analysis and told us which models
predict the models best. So the majority of the techniques
used both Accuracy and RMSE to evaluate the performance
of their models.
C. POTENTIAL CHALLENGES HIGHLIGHTED IN EXISTING
STUDIES TO BUILD A ROBUST SPATIO-TEMPORAL CRIME
PREDICTION MODEL (RQ3)
Several challenges need serious attention from researchers
to build a robust Spatio-temporal crime forecasting model.
One primary and most signiﬁcant challenge in investigating
crime forecasting is the accuracy and reliability of the data.
It is evident from the SLR that more than 80 percent of
studies failed to cite a dataset or even they do not describe
its characteristics. It is assumed that if they provide some
dataset, someone else may use it for the wrong purpose.
Several factors can contribute to the limitations of the crime
data.
The ﬁrst barrier is under-reporting, where people do not
report a crime. This is the primary reason that could not be
added to the ofﬁcial statistics. A survey was conducted by the
Malaysian and British police that approximately 50% failed
to report the actual crime [129], [130]. Another constraint in
crime data is the accuracy and reliability of data classiﬁcation
by the law and enforcement agencies.
Existing researches have been reported without the spatial
and temporal information in the crime datasets [67], [131].
The last few years, with the inclusion of spatial and temporal
information, urges the researchers to ﬁll the research gaps and
unmet needs of the law enforcement agencies. There are very
few datasets that have been reported so far with the temporal
and spatial information. The technological advancement in
geographical information, such as the ArcGIS tool that is
widely used for crime mapping helps the crime reporting
agencies to overcome this issue. However, only 5 to 10 10%
datasets are publicly available. 60% of the reported studies
have presented their results on Chicago crime dataset [5],
[89], [105] because it is publicly available. The proposed
models lack in terms of generalizability because the model
is trained in a particular area with a particular context. There
could be several variations in demographic trends, cultures,
methods of crime, and factors of crime across the countries.
So, there is a dire need for transfer learning to identify poten-
tial areas and factors of crime that are common and to bring
adaptability in the model.
TABLE 13. Evaluation measures reported for crime hotspot prediction.
Transfer learning is an important area of research due to
its ability to solve one task based on the experience of other
related tasks. Traditional machine learning techniques are
designed to solve a particular task. Recently, transfer learning
has been used in different areas of research from trafﬁc
prediction [132] to ﬁnancial time forecasting [133] and air
quality prediction [134] etc. Transfer learning can be used for
crime forecasting for areas with similar demographic trends
and even for different countries. Transfer learning makes a
generalized model that uses his experience and works well in
the new setting.
Another critical aspect identiﬁed by the researcher is the
inclusion of demographic factors while model building [99],
[112]. It is suggested that by including demographic trends
and events of the city, crime forecasting can be enhanced.
It is assumed that crime has a positive correlation with the
socioeconomic characteristics of demographic factors like;
occupation, income, marital status, population, religion, birth
rate, and death rate, etc. Some studies have also been reported
VOLUME 8, 2020
166567

--- Page 16 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
for crime prediction using Social media analysis and other
factors [131], [135], [14]. Mainly, twitter data has been
widely used for crime prediction. So, in future crime data,
demographic factors and social network analysis can be used
to make a robust crime prediction framework.
One major drawback identiﬁed from the proposed
approaches is that majority literature failed to provide a robust
comparison of the proposed technique with the state-of-the-
art techniques. To make a robust Spatio-temporal crime pre-
diction system, a reliable comparison should be made with the
same experimental setup. It is also suggested that forecasting
can be improved by expending time series analysis with
SARIMA and some explanatory variables. Long short term
memory can also be used with time series analysis to build a
robust system.
D. WHAT TYPE OF DATASETS HAVE BEEN USED FOR
CRIME PREDICTION (RQ4A)
The most signiﬁcant problem identiﬁed in Spatio-temporal
hotspot detection is the unavailability of the geocoded crime
datasets. During the entire SLR process, it has been exam-
ined that a vast amount of literature failed even to cite
the dataset. Some papers mentioned the details of the area
covering the dataset but not cited them. Some researchers
excuse in their papers that they cannot share the details of the
dataset due to sensitive information provided by the police
department.
This SLR aims to present the state-of-the-art datasets
publicly available with all the necessary details for the
researchers and beginners. Details of the datasets, along with
the links, are shown in Table 14. It is evident from the
Table that the Chicago crime dataset is widely used as it is
geocoded and publicly available. Many researchers evaluated
their proposed methodology on this dataset.
A dataset can contain different kinds of crimes reported
by law enforcement agencies. It can be seen in Table 14
and a pie chart distribution in Fig. 9 that the researchers
have widely used resident burglary crime type. It can be
inferred from this information that resident burglary (40 %)
is the most critical area that needs to be addressed. Secondly,
to prevent street crimes (30 %), several methods have been
proposed. Violent felonies and Homicide constitute 22 and
8 % respectively of the total crime types researchers have
used.
Crime datasets presented in the literature are very few,
and some are even have not the time and location infor-
mation. So, there is dire need to present a Spatio-temporal
labeled dataset and made it publicly available. There are very
limited crime datasets of the Asia region, and the majority
are not Spatio-temporal labeled. As crimes graph is differ-
ent concerning time and location and geographical area and
datasets are very limited. One technique can not be evalu-
ated on society of certain norms and demographic factors.
So crime datasets should be reported for different regions to
predict crime that will help the agencies to provide a safer
environment.
FIGURE 9. (%) Studies reported on specific crime types.
1) WHAT ARE THE MAIN ASPECTS OF A DATASET FOR THE
SPATIO-TEMPORAL CRIME HOTSPOT? DO THEY AFFECT
RESULTS? (RQ4B)
The police department professionally acquires the datasets
presented in Table 14. However, there are some datasets
mentioned in the Table that are not Spatial and Temporal
labeled [71], [73], [74]. With the advancement in the
GIS system, spatial and temporal information can be added
along with the crime incident characteristics. From the past
few years, the inclusion of spatial and temporal information
in crime datasets urge the researchers to propose new and
enhanced techniques for crime hotspot detection and pre-
diction. Crime datasets acquisition is a critical mechanism
that can affect the efﬁciency and robustness of techniques
proposed by the researchers.
The reliability and accuracy of the crime datasets are
the primary concern for researchers that is dependent on
the Acquired authority. So, there is dire need to check the
reliability of the dataset while performing evaluations. One
preeminent aspect is the inclusion of spatial and temporal
information of the crime incident. From the last few years,
researchers [105]–[107] found spatial and temporal quiet
helpful and proposed several techniques for crime hotspot
prediction.
To make a dataset useful for crime prediction, it should be
reliable, accurate, and Spatio-temporal labeled. Some crime
events are reported by the police ofﬁcers and sometimes by
the people who are victims. The timely investigation can help
them to collect all the relevant details; otherwise, the victim
can forget some details. Law enforcement agencies need to
conduct awareness and practical workshops for the ofﬁcers
about the GIS so that data acquisition can be made accurately.
This will increase the prediction accuracy and efﬁciency of
the crime events likely to occur in the future.
V. ANALYSIS
The primary objective of this SLR is to present and sum-
marize existing techniques for crime prediction comprehen-
sively. Speciﬁcally, it aims to answer the deﬁned research
questions by thoroughly reviewing the selected articles which
were ﬁltered using the inclusion, exclusion, and quality
166568
VOLUME 8, 2020

--- Page 17 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
TABLE 14. Spatio-temporal datasets and their characteristics used for crime prediction.
VOLUME 8, 2020
166569

--- Page 18 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
assessment criteria. RQ1 and RQ2 are aimed to identify
crime hotspot detection and prediction techniques along with
performance measures used. In RQ3 potential gaps and
challenges faced by the above techniques are thoroughly
described that will help the beginners to start their research
journey. RQ4 enlighten on the importance and aspects of the
crime datasets should have.
The ﬁrst task in crime prediction mechanism is to detect
crime hotspot regions where crime occurrence is higher
and active than other regions. Advancement in geographical
information system gives a new horizon to crime hotspot
detection by embedding spatial and temporal information in
crime datasets. It also enables the researchers to mark the
hotspot regions and efﬁciently analyze and visualize their
respective change. RQ1 is formulated to identify the crime
hotspot detection approaches reported for the last ten years
and prominent approaches among them, along with the per-
formance measure used.
It is evident from the Table 8 that several machine learn-
ing and data mining approaches have been attempted for
crime hotspot detection. However, clustering and classiﬁ-
cation approach found to be more useful in crime hotspot
detection. Precisely, Random forest [92] and DBSCAN [112]
algorithm has been reported recently and compared with
state-of-the-art techniques and found to be efﬁcient and effec-
tive. Researchers are still facing the accuracy gap provided by
these techniques. They aim to overcome the limitation of the
recent developments in crime hotspot detection so that it can
be implemented in the real world.
Efﬁcient crime hotspot detection enables a machine learn-
ing to learn the proximity of a crime so that it can be
predicted in future. In this regard and based on crime pre-
vention importance by predicting crime, several techniques
have been presented and implemented in different areas of
developed countries. Again, data mining and machine learn-
ing approaches, speciﬁcally time series analysis techniques,
have been widely used for crime prediction. From the last
many years, classiﬁcation and clustering algorithms have
been used in a signiﬁcant number for predicting future crime.
Nevertheless, these approaches alone were not so reliable and
practical to implement in the real world. Recently time series
analysis gave a breakthrough in crime prediction by boosting
the prediction mechanism.
Time series analysis is derived from the statistical and
econometrics area collectively to understand and predict
the future occurrences from the time series data. Mainly,
ARIMA [112] has been used recently with the Spatio-temporal
crime data for crime prediction and outperformed the state-
of-the-art techniques. ARIMA models have been widely used
in literature for forecasting of different real-world events like;
energy consumption [136], inﬂation [137], wind speed [138],
and economics [139] etc. However, the problem with the
ARIMA is that it cannot capture the seasonality and repeated
behaviour of event, especially crime events. So an enhanced
forecasting algorithm should be in place to predict crime
event efﬁciently by resolving seasonality factor.
Several performance measures have been used in the lit-
erature to evaluate the performance of crime detection and
prediction algorithms. The purpose of studying different per-
formance measures used in the existing literature is to come
up with the most reliable and widely used measures so that
the beginners can follow a standard measure. This will also
help a researcher to compare the accuracy and efﬁciency
of his algorithm with the state-of-the-art techniques in the
same experimental setup with the same performance mea-
sures. The most widely used performance measures are Mean
Absolute Error (MAE), Mean Absolute Percentage Error
(MAPE), Mean Error (ME), and Root Mean Square Error
(RMSE).
RQ3 discusses the potential challenges faced by the
researchers and potential techniques. It aims to identify the
potential gaps so that a new researcher in this ﬁeld can easily
understand the unmet needs and act on it. Several potential
areas have been identiﬁed for future research throughout
this SLR and pilot study process such as; use of transfer
learning [15], [140], [141] enhancement of crime hotspot
detection algorithm(DBSCAN) for boosting detection accu-
racy, enhancement of crime forecasting algorithm (ARIMA)
for prediction accuracy improvement, Long Short Term
Memory (LSTM) with exponential smoothing [139], [142],
the inclusion of demographic factors, and social network
analysis etc., for crime prediction as shown in Fig. 10.
FIGURE 10. Potential areas for future research.
The most essential and prominent aspect of crime pre-
diction is the labelled spatio-temporal datasets. It has been
noticed during this SLR that the majority of the studies failed
to cite the datasets and some are not publicly available. Some
studies have excused that due to sensitive data and agreement
by the respective police, they cannot share the details of the
datasets. The two most widely used and publicly available
datasets are Chicago [106] and New York city datasets [105].
RQ4 formulated to emphasize the importance and necessity
of more publicly available datasets. So a researcher can con-
tribute to the body of knowledge of crime prediction by pre-
senting a novel datasets. This SLR concludes by enlightening
on the reliability, accuracy and timeliness issues of crime
datasets that can affect the overall performance and efﬁciency
of crime prediction algorithms.
166570
VOLUME 8, 2020

--- Page 19 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
VI. CONCLUSION AND FUTURE STUDY
In this study, we systematically unfold the critical aspects of
crime hotspot detection and prediction mechanism by follow-
ing the guidelines of Kitchenham and Charters [25]. This is
the only SLR presented to the best of author’s knowledge
from the last ten years that summarize and organize the
scattered shreds of evidence in the area of crime prediction.
Notably, this SLR performed to investigate the unmet needs
and future directions from 49 selected research articles pub-
lished from January 2010 to December 2019.
The primary objective of this research is two-fold. First,
it focuses on crime hotspot detection approaches presented
so far and identify the most leading and effective approaches
among them, along with the performance measure used. It is
evident from the Table 9 that DBSCAN and Random forest
are found to be useful and efﬁcient in terms of accuracy and
efﬁciency. However, several limitations were identiﬁed [143]
during the SLR that crime hot spot detection algorithm should
be; scalable, can deal with sparsity, underlying population,
and demographic factors, etc.
Secondly, crime prediction strategies have been analyzed
comprehensively. Several data mining and machine learning
approaches have been applied but failed to perform in the
real-world. Recently, the time series analysis area has been
explored by the researchers for crime prediction and found
to be comparatively efﬁcient. Correctly, ARIMA has been
used in forecasting different real-world events like; energy
consumption prediction, economic trend, and air pressure,
etc., although it can predict on the data that indicate trends.
Nevertheless, for crime prediction, ARIMA models need
improvement for handling crime that exhibits seasonal and
repetitive behavior in nature. In the future, a prediction algo-
rithm may consider the social network connection, geotags,
social networking posts, and trends of crime with the events
in a particular city.
This SLR concludes that crime hotspot detection and pre-
diction is a crucial process that needs further investigation.
Several important research areas are identiﬁed during this
systematic process that will helps the researchers to build an
enhanced and more robust crime prediction system. Addi-
tionally, novel spatio-temporal datasets should be produced to
enhance the effectiveness of the proposed approaches, and a
region must have a dataset so that crime prevention strategies
can be made that will boost the growth of a country.
REFERENCES
[1] M. M. Ul Islam and S. Hussain, ‘‘Impact of crime and corruption on
GDP per capita an empirical analysis of cross-country data,’’ Pakistan
J. Criminol., vol. 10, no. 2, pp. 72–93, 2018.
[2] J. Wang, J. Hu, S. Shen, J. Zhuang, and S. Ni, ‘‘Crime risk analysis
through big data algorithm with urban metrics,’’ Phys. A, Stat. Mech.
Appl., vol. 545, May 2020, Art. no. 123627.
[3] J. Chin and C. Bürge, ‘‘Twelve days in Xinjiang: how China’s surveillance
state overwhelms daily life,’’ Wall Street J., vol. 19, 2017.
[4] G. Blackman, ‘‘View from the east: Greg blackman charts the meteoric
rise of Chinese ﬁrm Hikvision, one of the top suppliers of video surveil-
lance equipment that has now turned its sights on industrial vision,’’ Imag.
Mach. Vis. Eur., vol. 84, no. 84, pp. 12–14, 2017.
[5] F. Yi, Z. Yu, F. Zhuang, X. Zhang, and H. Xiong, ‘‘An integrated model
for crime prediction using temporal and spatial factors,’’ in Proc. IEEE
Int. Conf. Data Mining (ICDM), Nov. 2018, pp. 1386–1391.
[6] A. L. Buczak and C. M. Gifford, ‘‘Fuzzy association rule mining for
community crime pattern discovery,’’ in Proc. ACM SIGKDD Workshop
Intell. Secur. Inform., 2010, p. 2.
[7] M. A. Tayebi, M. Ester, U. Glässer, and P. L. Brantingham, ‘‘Crimetracer:
Activity space based crime location prediction,’’ in Proc. IEEE/ACM Int.
Conf. Adv. Social Netw. Anal. Mining. Aug. 2014, pp. 472–480.
[8] R. K. Wortley and L. A. Mazerolle, Environmental Criminology and
Crime Analysis, vol. 6. 2016.
[9] A. Belesiotis, G. Papadakis, and D. Skoutas, ‘‘Analyzing and predicting
spatial crime distribution using crowdsourced and open data,’’ ACM
Trans. Spatial Algorithms Syst., vol. 3, no. 4, p. 12, 2018.
[10] A. Deshmukh, S. Banka, S. B. Dcruz, S. Shaikh, and A. K. Tripathy,
‘‘Safety App: Crime prediction using GIS,’’ in Proc. 3rd Int. Conf.
Commun. Syst., Comput. Appl. (CSCITA), Apr. 2020, pp. 120–124.
[11] K. Islam and A. Raza, ‘‘Forecasting crime using ARIMA model,’’ 2020,
arXiv:2003.08006. [Online]. Available: http://arxiv.org/abs/2003.08006
[12] S. Jha, E. Yang, A. O. Almagrabi, A. K. Bashir, and G. P. Joshi, ‘‘Com-
parative analysis of time series model and machine testing systems for
crime forecasting,’’ Neural Comput. Appl., May 2020.
[13] B.
Wang,
D.
Zhang,
D.
Zhang,
P.
J.
Brantingham,
and
A. L. Bertozzi, ‘‘Deep learning for real time crime forecasting,’’ 2017,
arXiv:1707.03340. [Online]. Available: http://arxiv.org/abs/1707.03340
[14] S. Wang and K. Yuan, ‘‘Spatiotemporal analysis and prediction of crime
events in atlanta using deep learning,’’ in Proc. IEEE 4th Int. Conf. Image,
Vis. Comput. (ICIVC), Jul. 2019, pp. 346–350.
[15] X. Zhao and J. Tang, ‘‘Exploring transfer learning for crime prediction,’’
in Proc. IEEE Int. Conf. Data Mining Workshops (ICDMW), Nov. 2017,
pp. 1158–1159.
[16] R. Valente, ‘‘Spatial and temporal patterns of violent crime in a Brazilian
state capital: A quantitative analysis focusing on micro places and small
units of time,’’ Appl. Geography, vol. 103, pp. 90–97, Feb. 2019.
[17] Z. Li, T. Zhang, Z. Yuan, Z. Wu, and Z. Du, ‘‘Spatio-temporal pattern
analysis and prediction for urban crime,’’ in Proc. 6th Int. Conf. Adv.
Cloud Big Data (CBD), Aug. 2018, pp. 177–182.
[18] N. H. M. Shamsuddin, N. A. Ali, and R. Alwee, ‘‘An overview on crime
prediction methods,’’ in Proc. 6th ICT Int. Student Project Conf. (ICT-
ISPC), May 2017, pp. 1–5.
[19] H. B. F. David, and A. Suruliandi, ‘‘Survey on crime analysis and pre-
diction using data mining techniques,’’ ICTACT J. Soft Comput., vol. 7,
no. 3, pp. 1459–1466, Apr. 2017.
[20] C. Chauhan and S. Sehgal, ‘‘A review: Crime analysis using data min-
ing techniques and algorithms,’’ in Proc. Int. Conf. Comput., Commun.
Autom. (ICCCA), May 2017, pp. 21–25.
[21] S. Prabakaran and S. Mitra, ‘‘Survey of analysis of crime detection
techniques using data mining and machine learning,’’ J. Phys. Conf. Ser.,
vol. 1000, no. 1, Apr. 2018, Art. no. 012046.
[22] H. Hassani, X. Huang, E. S. Silva, and M. Ghodsi, ‘‘A review of data
mining applications in crime,’’ Stat. Anal. Data Mining, ASA Data Sci. J.,
vol. 9, no. 3, pp. 139–154, Jun. 2016.
[23] P. Kapoor, P. K. Singh, and A. K. Cherukuri, ‘‘Crime data set analysis
using formal concept analysis (FCA): A survey,’’ in Advances in Data Sci-
ences, Security and Applications. Singapore: Springer, 2020, pp. 15–31.
[24] M. Helbich and M. Leitner, ‘‘Frontiers in spatial and spatiotemporal crime
analytics—An editorial,’’ vol. 6, no. 73, p. 1, 2017.
[25] B. Kitchenham and S. Charters, ‘‘Guidelines for performing systematic
literature reviews in software engineering,’’ 2007.
[26] F. Weidt and R. Silva, ‘‘Systematic literature review in computer science-a
practical guide,’’ Relatórios Técnicos do DCC/UFJF, Juiz de Fora, Brazil,
Tech. Rep., 2016, vol. 1.
[27] C. C. Agbo, Q. H. Mahmoud, and J. M. Eklund, ‘‘Blockchain technology
in healthcare: A systematic review,’’ in Healthcare, vol. 7, no. 2, p. 56,
2019.
[28] A. Vázquez-Ingelmo, F. J. Garcia-Peñalvo, and R. Therón, ‘‘Informa-
tion dashboards and tailoring capabilities-a systematic literature review,’’
IEEE Access, vol. 7, pp. 109673–109688, 2019.
[29] L. G. D. Véras, F. L. Medeiros, and L. N. Guimaráes, ‘‘Systematic
literature review of sampling process in rapidly-exploring random trees,’’
IEEE Access, vol. 7, pp. 50933–50953, 2019.
[30] S. K. Lo, Y. Liu, S. Y. Chia, X. Xu, Q. Lu, L. Zhu, and H. Ning, ‘‘Analysis
of blockchain solutions for IoT: A systematic literature review,’’ IEEE
Access, vol. 7, pp. 58822–58835, 2019.
VOLUME 8, 2020
166571

--- Page 20 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
[31] N. A. S. Zaidi, A. Mustapha, S. A. Mostafa, and M. N. Razali, ‘‘A
classiﬁcation approach for crime prediction,’’ in Proc. Int. Conf. Appl.
Comput. Support Ind. Innov. Technol. Cham, Switzerland: Springer, 2019,
pp. 68–78.
[32] N. Ibrahim, S. Wang, and B. Zhao, ‘‘Spatiotemporal crime hotspots
analysis and crime occurrence prediction,’’ in Proc. Int. Conf. Adv. Data
Mining Appl. Cham, Switzerland: Springer, 2019, pp. 579–588.
[33] M. Kajita and S. Kajita, ‘‘Crime prediction by data-driven green’s func-
tion method,’’ Int. J. Forecasting, 2019.
[34] U. Thongsatapornwatana, ‘‘A survey of data mining techniques for
analyzing crime patterns,’’ in Proc. 2nd Asian Conf. Defence Technol.
(ACDT), Jan. 2016, pp. 123–128.
[35] Z. Jiang, ‘‘A survey on spatial prediction methods,’’ IEEE Trans. Knowl.
Data Eng., vol. 31, no. 9, pp. 1645–1664, Sep. 2019.
[36] N. Dubey and S. K. Chaturvedi, ‘‘A survey paper on crime prediction
technique using data mining,’’ Int. J. Eng. Res. Appl., 2014.
[37] S. Wang, J. Cao, and P. S. Yu, ‘‘Deep learning for spatio-temporal
data mining: A survey,’’ 2019, arXiv:1906.04928. [Online]. Available:
http://arxiv.org/abs/1906.04928
[38] K. Leong and A. Sung, ‘‘A review of spatio-temporal pattern analysis
approaches on crime analysis,’’ 2015.
[39] L. Juan, T. Guoan, Z. Hong, J. Ping, and W. Wei, ‘‘A review of research
methods for spatiotemporal distribution of the crime hot spots,’’ Prog.
Geography, vol. 31, no. 4, pp. 419–425, 2012.
[40] Z. Shi and L. Pun-Cheng, ‘‘Spatiotemporal data clustering: A survey of
methods,’’ ISPRS Int. J. Geo-Inf., vol. 8, no. 3, p. 112, Feb. 2019.
[41] D. V. Rohini and P. Isakki, ‘‘Crime analysis and mapping through online
newspapers: A survey,’’ in Proc. Int. Conf. Comput. Technol. Intell. Data
Eng. (ICCTIDE), Jan. 2016, pp. 1–4.
[42] G. Zhou, J. Lin, and X. Ma, ‘‘A web-based GIS for crime mapping
and decision support,’’ in Forensic GIS. Dordrecht, The Netherlands:
Springer, 2014, pp. 221–243.
[43] J. Ratcliffe, ‘‘Crime mapping: Spatial and temporal challenges,’’ in Hand-
book of Quantitative Criminology. New York, NY, USA: Springer, 2010,
pp. 5–24.
[44] G. Atluri, A. Karpatne, and V. Kumar, ‘‘Spatio-temporal data mining: A
survey of problems and methods,’’ ACM Comput. Surv., vol. 51, no. 4,
pp. 1–41, 2018.
[45] A. T. Murray and T. H. Grubesic, ‘‘Exploring spatial patterns of crime
using non-hierarchical cluster analysis,’’ in Crime Modeling and Mapping
Using Geospatial Technologies. Dordrecht, The Netherlands: Springer,
2013, pp. 105–124.
[46] A. Bapat and S. Desai, ‘‘A comparative study of analysing and clustering
crime patterns using data mining,’’ Tech. Rep.
[47] S. Shekhar, Z. Jiang, R. Ali, E. Eftelioglu, X. Tang, V. Gunturi, and
X. Zhou, ‘‘Spatiotemporal data mining: A computational perspective,’’
ISPRS Int. J. Geo-Inf., vol. 4, no. 4, pp. 2306–2338, Oct. 2015.
[48] D. Zeng, W. Chang, and H. Chen, ‘‘A comparative study of spatio-
temporal hotspot analysis techniques in security informatics,’’ in Proc.
7th Int. IEEE Conf. Intell. Transp. Syst., 2004, pp. 106–111.
[49] M. Farsi, A. Daneshkhah, A. H. Far, O. Chatrabgoun, and R. Montasari,
‘‘Crime data mining, threat analysis and prediction,’’ in Cyber Criminol-
ogy. Cham, Switzerland: Springer, 2018, pp. 183–202.
[50] C.-H. Yu, M. W. Ward, M. Morabito, and W. Ding, ‘‘Crime forecasting
using data mining techniques,’’ in Proc. IEEE 11th Int. Conf. Data Mining
Workshops, Dec. 2011, pp. 779–786.
[51] B. Taylor, C. S. Koper, and D. J. Woods, ‘‘A randomized controlled trial
of different policing strategies at hot spots of violent crime,’’ J. Exp.
Criminol., vol. 7, no. 2, pp. 149–181, Jun. 2011.
[52] C. S. Nwankwo, M. K. Raji, and E. S. Oghogho, ‘‘Application of data
analytics techniques in analyzing crimes,’’ Tech. Rep., 2018.
[53] E. L. Piza and J. G. Carter, ‘‘Predicting initiator and near repeat events
in spatiotemporal crime patterns: An analysis of residential burglary
and motor vehicle theft,’’ Justice Quart., vol. 35, no. 5, pp. 842–870,
Jul. 2018.
[54] S. N. Nair and E. Gopi, ‘‘Deep learning techniques for crime hotspot
detection,’’ in Optimization in Machine Learning and Applications.
Singapore: Springer, 2020, pp. 13–29.
[55] S. V. Nath, ‘‘Crime pattern detection using data mining,’’ in Proc.
IEEE/WIC/ACM Int. Conf. Web Intell. Intell. Agent Technol. Workshops,
Dec. 2006, pp. 41–44.
[56] L. G. Mazerolle, C. Bellucci, and F. Gajewski, ‘‘Crime mapping in
police departments: The challenges of building a mapping system,’’
Tech. Rep., 1998.
[57] M. Leitner, Crime Modeling and Mapping Using Geospatial Technolo-
gies, vol. 8. Springer, 2013.
[58] B. Kitchenham, ‘‘Procedures for performing systematic reviews,’’ Keele
Univ., Keele, U.K., Tech. Rep. 0400011T.1, 2004, vol. 33, pp. 1–26.
[59] K. Bartleson. (1963). Institute of Electrical and Electronics Engineers.
Accessed: Feb. 2, 2020. [Online]. Available: https://www.ieee.org
[60] J. Springer. (1842). Springer Science+Business Media. Accessed:
Feb. 1, 2020. [Online]. Available: https://link.springer.com/
[61] R. Hamming. (1947). Association for Computing Machinery. Accessed:
Feb. 2, 2020. [Online]. Available: https://dl.acm.org
[62] Elsevier. (1997). Science Direct. Accessed: Feb. 2, 2020. [Online]. Avail-
able: https://www.sciencedirect.com
[63] (2004).
Scopus.
Accessed:
Feb.
2,
2020.
[Online].
Available:
https://www.scopus.com/search/form.uri?display=basic
[64] B. A. Kitchenham, E. Mendes, and G. H. Travassos, ‘‘Cross versus
within-company cost estimation studies: A systematic review,’’ IEEE
Trans. Softw. Eng., vol. 33, no. 5, pp. 316–329, May 2007.
[65] D. Azhar, E. Mendes, and P. Riddle, ‘‘A systematic review of Web
resource estimation,’’ in Proc. 8th Int. Conf. Predictive Models Softw.
Eng., 2012, pp. 49–58.
[66] M. Usman, E. Mendes, F. Weidt, and R. Britto, ‘‘Effort estimation in agile
software development: A systematic literature review,’’ in Proc. 10th Int.
Conf. Predictive Models Softw. Eng., 2014, pp. 82–91.
[67] P. Phillips and I. Lee, ‘‘Crime analysis through spatial areal aggregated
density patterns,’’ GeoInformatica, vol. 15, no. 1, pp. 49–74, Jan. 2011.
[68] Y. Zhang and H. Ji, ‘‘Using GIS to analyze and forecast the Chinese crime
rate,’’ in Proc. 2nd Int. Conf. Inf. Sci. Eng., Dec. 2010, pp. 3352–3354.
[69] Z. Wang, J. Wu, and B. Yu, ‘‘Analyzing spatio-temporal distribution of
crime hot-spots and their related factors in shanghai, China,’’ in Proc.
19th Int. Conf. Geoinformat., Jun. 2011, pp. 1–6.
[70] J. L. Toole, N. Eagle, and J. B. Plotkin, ‘‘Spatiotemporal correlations in
criminal offense records,’’ ACM Trans. Intell. Syst. Technol., vol. 2, no. 4,
pp. 1–18, Jul. 2011.
[71] M. Helbich and M. Leitner, ‘‘Evaluation of spatial cluster detection algo-
rithms for crime locations,’’ in Challenges at the Interface of Data Anal-
ysis, Computer Science, and Optimization. Berlin, Germany: Springer,
2012, pp. 193–201.
[72] D. McDowall, C. Loftin, and M. Pate, ‘‘Seasonal cycles in crime, and their
variability,’’ J. Quant. Criminol., vol. 28, no. 3, pp. 389–410, Sep. 2012.
[73] O. E. Isaﬁade and A. B. Bagula, ‘‘CitiSafe: Adaptive spatial pattern
knowledge using fp-growth algorithm for crime situation recognition,’’
in Proc. IEEE 10th Int. Conf. Ubiquitous Intell. Comput. IEEE 10th Int.
Conf. Autonomic Trusted Comput., Dec. 2013, pp. 551–556.
[74] S.-M. Huang, ‘‘A study of the application of data mining on the spatial
landscape allocation of crime hot spots,’’ in Geo-Informatics in Resource
Management and Sustainable Ecosystem. Berlin, Germany: Springer,
2013, pp. 274–286.
[75] R. E. Roth, K. S. Ross, B. G. Finch, W. Luo, and A. M. MacEachren,
‘‘Spatiotemporal crime analysis in us law enforcement agencies: Current
practices and unmet needs,’’ Government Inf. Quart., vol. 30, no. 3,
pp. 226–240, 2013.
[76] D. Wang, W. Ding, H. Lo, T. Stepinski, J. Salazar, and M. Morabito,
‘‘Crime hotspot mapping using the crime related factors-a spatial data
mining approach,’’ Int. J. Speech Technol., vol. 39, no. 4, pp. 772–781,
2013.
[77] C.-H. Yu, W. Ding, P. Chen, and M. Morabito, ‘‘Crime forecasting using
spatio-temporal pattern with ensemble learning,’’ in Proc. Paciﬁc–Asia
Conf. Knowl. Discovery Data Mining. Cham, Switzerland: Springer,
2014, pp. 174–185.
[78] A. Bogomolov, B. Lepri, J. Staiano, N. Oliver, F. Pianesi, and A. Pentland,
‘‘Once upon a crime: Towards crime prediction from demographics
and mobile data,’’ in Proc. 16th Int. Conf. Multimodal Interact., 2014,
pp. 427–434.
[79] M. S. Gerber, ‘‘Predicting crime using Twitter and kernel density estima-
tion,’’ Decis. Support Syst., vol. 61, pp. 115–125, May 2014.
[80] E. Johansson, C. Gåhlin, and A. Borg, ‘‘Crime hotspots: An evaluation of
the KDE spatial mapping technique,’’ in Proc. Eur. Intell. Secur. Informat.
Conf., Sep. 2015, pp. 69–74.
[81] L. Conrow, J. Aldstadt, and N. S. Mendoza, ‘‘A spatio-temporal analysis
of on-premises alcohol outlets and violent crime events in buffalo, NY,’’
Appl. Geography, vol. 58, pp. 198–205, Mar. 2015.
[82] M. Hanslmaier, S. Kemme, K. Stoll, and D. Baier, ‘‘Forecasting crime in
Germany in times of demographic change,’’ Eur. J. Criminal Policy Res.,
vol. 21, no. 4, pp. 591–610, Dec. 2015.
166572
VOLUME 8, 2020

--- Page 21 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
[83] B. Cavadas, P. Branco, and S. Pereira, ‘‘Crime prediction using regression
and resources optimization,’’ in Proc. Portuguese Conf. Artif. Intell.
Cham, Switzerland: Springer, 2015, pp. 513–524.
[84] M. R. Parvez, T. Mosharraf, and M. E. Ali, ‘‘A novel approach to identify
spatio-temporal crime pattern in Dhaka city,’’ in Proc. 8th Int. Conf. Inf.
Commun. Technol. Develop., 2016, pp. 1–4.
[85] F. Wajid and H. Samet, ‘‘Crimestand: Spatial tracking of criminal activ-
ity,’’ in Proc. 24th ACM SIGSPATIAL Int. Conf. Adv. Geographic Inf.
Syst., 2016, p. 81.
[86] Q. Zhang, P. Yuan, Q. Zhou, and Z. Yang, ‘‘Mixed spatial-temporal
characteristics based crime hot spots prediction,’’ in Proc. IEEE 20th Int.
Conf. Comput. Supported Cooperat. Work Design (CSCWD), May 2016,
pp. 97–101.
[87] C.-H. Yu, W. Ding, M. Morabito, and P. Chen, ‘‘Hierarchical spatio-
temporal pattern discovery and predictive modeling,’’ IEEE Trans.
Knowl. Data Eng., vol. 28, no. 4, pp. 979–993, Apr. 2016.
[88] L. Weihong, W. Lei, and C. Yebin, ‘‘Spatial–temporal forecast research
of property crime under the driven of urban trafﬁc factors,’’ Multimedia
Tools Appl., vol. 75, no. 24, pp. 17669–17687, 2016.
[89] E. Cesario, C. Catlett, and D. Talia, ‘‘Forecasting crimes using autore-
gressive models,’’ in Proc. IEEE 14th Intl Conf Dependable, Auto-
nomic Secure Comput., 14th Int. Conf. Pervasive Intell. Comput.,
2nd Int. Conf Big Data Intell. Comput. Cyber Sci. Technol. Congr.
(DASC/PiCom/DataCom/CyberSciTech), Aug. 2016, pp. 795–802.
[90] X. Zhao and J. Tang, ‘‘Modeling temporal-spatial correlations for crime
prediction,’’ in Proc. ACM Conf. Inf. Knowl. Manage., Nov. 2017,
pp. 497–506.
[91] Y. Zhuang, M. Almeida, M. Morabito, and W. Ding, ‘‘Crime hot spot
forecasting: A recurrent model with spatial and temporal information,’’
in Proc. IEEE Int. Conf. Big Knowl. (ICBK), Aug. 2017, pp. 143–150.
[92] J. Borges, D. Ziehr, M. Beigl, N. Cacho, A. Martins, S. Sudrich,
S. Abt, P. Frey, T. Knapp, M. Etter, and J. Popp, ‘‘Feature engineering
for crime hotspot detection,’’ in Proc. IEEE SmartWorld, Ubiquitous
Intell. Comput., Adv. Trusted Comput., Scalable Comput. Commun.,
Cloud Big Data Comput., Internet People Smart City Innov. (Smart-
World/SCALCOM/UIC/ATC/CBDCom/IOP/SCI), Aug. 2017, pp. 1–8.
[93] M. J. C. Baculo, C. S. Marzan, R. de Dios Bulos, and C. Ruiz,
‘‘Geospatial-temporal analysis and classiﬁcation of criminal data in
manila,’’ in Proc. 2nd IEEE Int. Conf. Comput. Intell. Appl. (ICCIA),
Sep. 2017, pp. 6–11.
[94] G. N. Kouziokas, ‘‘The application of artiﬁcial intelligence in pub-
lic administration for forecasting high crime risk transportation areas
in urban environment,’’ Transp. Res. Procedia, vol. 24, pp. 467–473,
Jan. 2017.
[95] A. Rummens, W. Hardyns, and L. Pauwels, ‘‘The use of predictive anal-
ysis in spatiotemporal crime forecasting: Building and testing a model in
an urban context,’’ Appl. Geography, vol. 86, pp. 255–261, Sep. 2017.
[96] F. Di Martino, W. Pedrycz, and S. Sessa, ‘‘Spatiotemporal extended fuzzy
C-means clustering algorithm for hotspots detection and prediction,’’
Fuzzy Sets Syst., vol. 340, pp. 109–126, Jun. 2018.
[97] S. K. Dash, I. Safro, and R. S. Srinivasamurthy, ‘‘Spatio-temporal predic-
tion of crimes using network analytic approach,’’ in Proc. IEEE Int. Conf.
Big Data (Big Data), Dec. 2018, pp. 1912–1917.
[98] Y. Hu, F. Wang, C. Guin, and H. Zhu, ‘‘A spatio-temporal kernel density
estimation framework for predictive crime hotspot mapping and evalua-
tion,’’ Appl. Geography, vol. 99, pp. 89–97, Oct. 2018.
[99] L. G. A. Alves, H. V. Ribeiro, and F. A. Rodrigues, ‘‘Crime prediction
through urban metrics and statistical learning,’’ Phys. A, Stat. Mech. Appl.,
vol. 505, pp. 435–443, Sep. 2018.
[100] S. K. Rumi, K. Deng, and F. D. Salim, ‘‘Crime event prediction with
dynamic features,’’ EPJ Data Sci., vol. 7, no. 1, p. 43, Dec. 2018.
[101] S. S. Deshmukh and B. Annappa, ‘‘Prediction of crime hot spots using
spatiotemporal ordinary kriging,’’ in Integrated Intelligent Computing,
Communication and Security. Singapore: Springer, 2019, pp. 683–691.
[102] R. Kumar and B. Nagpal, ‘‘Analysis and prediction of crime patterns using
big data,’’ Int. J. Inf. Technol., vol. 11, no. 4, pp. 799–805, Dec. 2019.
[103] T. Hodgkinson and M. A. Andresen, ‘‘Changing spatial patterns of resi-
dential burglary and the crime drop: The need for spatial data signatures,’’
J. Criminal Justice, vol. 61, pp. 90–100, Mar. 2019.
[104] C. Kadar, R. Maculan, and S. Feuerriegel, ‘‘Public decision support
for low population density areas: An imbalance-aware hyper-ensemble
for spatio-temporal crime prediction,’’ Decis. Support Syst., vol. 119,
pp. 107–117, Apr. 2019.
[105] C. Catlett, E. Cesario, D. Talia, and A. Vinci, ‘‘A data-driven approach
for spatio-temporal crime predictions in smart cities,’’ in Proc. IEEE Int.
Conf. Smart Comput. (SMARTCOMP), Jun. 2018, pp. 17–24.
[106] M. Oliveira and R. Menezes, ‘‘Spatial concentration and temporal
regularities in crime,’’ 2019, arXiv:1901.03589. [Online]. Available:
http://arxiv.org/abs/1901.03589
[107] S. A. Chun, V. A. Paturu, S. Yuan, R. Pathak, V. Atluri, and N. R. Adam,
‘‘Crime prediction model using deep neural networks,’’ in Proc. 20th
Annu. Int. Conf. Digit. Government Res., 2019, pp. 512–514.
[108] J. Q. Yuki, M. M. Q. Sakib, Z. Zamal, K. M. Habibullah, and A. K. Das,
‘‘Predicting crime using time and location data,’’ in Proc. 7th Int. Conf.
Comput. Commun. Manage., Jul. 2019, pp. 124–128.
[109] B. Shebaro and C. P. Fisher, ‘‘Crime in the 21 st century: A co-teaching
experience,’’ J. Comput. Sci. Colleges, vol. 34, no. 5, pp. 54–62, 2019.
[110] M. Feng, J. Zheng, J. Ren, A. Hussain, X. Li, Y. Xi, and Q. Liu, ‘‘Big data
analytics and mining for effective visualization and trends forecasting of
crime data,’’ IEEE Access, vol. 7, pp. 106111–106123, 2019.
[111] C. A. Piña-García and L. Ramírez-Ramírez, ‘‘Exploring crime patterns in
mexico city,’’ J. Big Data, vol. 6, no. 1, p. 65, Dec. 2019.
[112] C. Catlett, E. Cesario, D. Talia, and A. Vinci, ‘‘Spatio-temporal crime
predictions in smart cities: A data-driven approach and experiments,’’
Pervasive Mobile Comput., vol. 53, pp. 62–74, Feb. 2019.
[113] F. K. Bappee, A. S. Júnior, and S. Matwin, ‘‘Predicting crime using spatial
features,’’ in Proc. Adv. Artif. Intell. 31st Can. Conf. Artif. Intell., Can. AI.
Cham, Switzerland: Springer, May 2018, pp. 367–373.
[114] D. Wang, W. Ding, T. Stepinski, J. Salazar, H. Lo, and M. Morabito,
‘‘Optimization of criminal hotspots based on underlying crime controlling
factors using geospatial discriminative pattern,’’ in Proc. Int. Conf. Ind.,
Eng. Other Appl. Appl. Intell. Syst. Berlin, Germany: Springer, 2012,
pp. 553–562.
[115] S. Khalid, F. Shoaib, T. Qian, Y. Rui, A. I. Bari, M. Sajjad, M. Shakeel,
and J. Wang, ‘‘Network constrained spatio-temporal hotspot mapping
of crimes in Faisalabad,’’ Appl. Spatial Anal. Policy, vol. 11, no. 3,
pp. 599–622, Sep. 2018.
[116] C.-H. Yu, W. Ding, M. Morabito, and P. Chen, ‘‘Hierarchical spatio-
temporal pattern discovery and predictive modeling,’’ IEEE Trans.
Knowl. Data Eng., vol. 28, no. 4, pp. 979–993, Apr. 2016.
[117] H. Wang, D. Kifer, C. Graif, and Z. Li, ‘‘Crime rate inference with big
data,’’ in Proc. 22nd ACM SIGKDD Int. Conf. Knowl. Discovery Data
Mining, Aug. 2016, pp. 635–644.
[118] M. Misyrlis, C. M. Cheung, A. Srivastava, R. Kannan, and V. Prasanna,
‘‘Spatio-temporal modeling of criminal activity,’’ in Proc. 2nd Int. Work-
shop Social Sens., 2017, pp. 3–8.
[119] M. A. Andresen, S. J. Linning, and N. Malleson, ‘‘Crime at places and
spatial concentrations: Exploring the spatial stability of property crime
in Vancouver BC, 2003–2013,’’ J. Quant. Criminol., vol. 33, no. 2,
pp. 255–275, 2017.
[120] G. Mohler, M. Porter, J. Carter, and G. LaFree, ‘‘Learning to rank spatio-
temporal event hotspots,’’ Crime Sci., vol. 9, no. 1, pp. 1–12, Dec. 2020.
[121] Y. Lee, O. SooHyun, and J. E. Eck, ‘‘A theory-driven algorithm for
real-time crime hot spot forecasting,’’ Police Quart., vol. 23, no. 2,
pp. 174–201, Jun. 2020.
[122] M. Al Boni and M. S. Gerber, ‘‘Automatic optimization of localized
kernel density estimation for hotspot policing,’’ in Proc. 15th IEEE Int.
Conf. Mach. Learn. Appl. (ICMLA), Dec. 2016, pp. 32–38.
[123] W. L. Koontz, Analysis and Prediction of Call for Service Data. Wash-
ington, DC, USA: U.S. Department of Justice, 2017.
[124] G. Ledray, ‘‘Open source crime prediction for the national institute of
justice,’’ Tech. Rep., 2017.
[125] P. Stalidis, T. Semertzidis, and P. Daras, ‘‘Examining deep learn-
ing architectures for crime classiﬁcation and prediction,’’ 2018,
arXiv:1812.00602. [Online]. Available: http://arxiv.org/abs/1812.00602
[126] A. HOME, ‘‘NIJ’s real-time crime forecasting challenge: An attempt to
encourage data scientists from every ﬁeld to think about criminal justice
problems,’’ Tech. Rep., 2018.
[127] G. Mohler and M. D. Porter, ‘‘Rotational grid, PAI-maximizing crime
forecasts,’’ Stat. Anal. Data Mining: ASA Data Sci. J., vol. 11, no. 5,
pp. 227–236, Oct. 2018.
[128] G. Saltos and M. Cocea, ‘‘An exploration of crime prediction using data
mining on open data,’’ Int. J. Inf. Technol. Decis. Making, vol. 16, no. 5,
pp. 1155–1181, Sep. 2017.
[129] A. S. Sidhu, ‘‘Crime levels and trends in the next decade,’’ J. Kuala
Lumpur Roy. Malaysia Police College, vol. 5, pp. 1–13, 2006.
VOLUME 8, 2020
166573

--- Page 22 ---

U. M. Butt et al.: Spatio-Temporal Crime HotSpot Detection and Prediction: A SLR
[130] K. Jansson, British Crime Survey-Measuring Crime for 25 Years. London,
U.K.: Citeseer, 2007.
[131] X. Wang, M. S. Gerber, and D. E. Brown, ‘‘Automatic crime prediction
using events extracted from twitter posts,’’ in Proc. Int. Conf. social
Comput., Behav.-Cultural Modeling, Predict. Berlin, Germany: Springer,
2012, pp. 231–238.
[132] C. Zhang, H. Zhang, J. Qiao, D. Yuan, and M. Zhang, ‘‘Deep transfer
learning for intelligent cellular trafﬁc prediction based on cross-domain
big data,’’ IEEE J. Sel. Areas Commun., vol. 37, no. 6, pp. 1389–1401,
Jun. 2019.
[133] Q.-Q. He, P. C.-I. Pang, and Y.-W. Si, ‘‘Transfer learning for ﬁnancial time
series forecasting,’’ in Proc. Paciﬁc Rim Int. Conf. Artif. Intell. Cham,
Switzerland: Springer, 2019, pp. 24–36.
[134] J. Ma, J. C. P. Cheng, C. Lin, Y. Tan, and J. Zhang, ‘‘Improving air quality
prediction accuracy at larger temporal resolutions using deep learning
and transfer learning techniques,’’ Atmos. Environ., vol. 214, Oct. 2019,
Art. no. 116885.
[135] X. Chen, Y. Cho, and S. Y. Jang, ‘‘Crime prediction using Twitter sen-
timent and weather,’’ in Proc. Syst. Inf. Eng. Design Symp., Apr. 2015,
pp. 63–68.
[136] S. Barak and S. S. Sadegh, ‘‘Forecasting energy consumption using
ensemble ARIMA–ANFIS hybrid algorithm,’’ Int. J. Electr. Power
Energy Syst., vol. 82, pp. 92–104, Nov. 2016.
[137] T. Nyoni, ‘‘Modeling and forecasting inﬂation in kenya: Recent insights
from arima and garch analysis,’’ Dimorian Rev., vol. 5, no. 6, pp. 16–40,
2018.
[138] E. Cadenas, W. Rivera, R. Campos-Amezcua, and C. Heard, ‘‘Wind speed
prediction using a univariate ARIMA model and a multivariate NARX
model,’’ Energies, vol. 9, no. 2, p. 109, Feb. 2016.
[139] S. Siami-Namini and A. Siami Namin, ‘‘Forecasting economics and
ﬁnancial time series: ARIMA vs. LSTM,’’ 2018, arXiv:1803.06386.
[Online]. Available: http://arxiv.org/abs/1803.06386
[140] R. Ye and Q. Dai, ‘‘A novel transfer learning framework for time series
forecasting,’’ Knowl.-Based Syst., vol. 156, pp. 74–99, Sep. 2018.
[141] M. Ribeiro, K. Grolinger, H. F. ElYamany, W. A. Higashino, and
M. A. M. Capretz, ‘‘Transfer learning with seasonal and trend adjust-
ment for cross-building energy forecasting,’’ Energy Buildings, vol. 165,
pp. 352–363, Apr. 2018.
[142] S. Smyl, ‘‘A hybrid method of exponential smoothing and recurrent neural
networks for time series forecasting,’’ Int. J. Forecasting, vol. 36, no. 1,
pp. 75–85, Jan. 2020.
[143] E. Eftelioglu, S. Shekhar, and X. Tang, ‘‘Crime hotspot detection: A
computational perspective,’’ in Improving the Safety and Efﬁciency of
Emergency Services: Emerging Tools and Technologies for First Respon-
ders. Hershey, PA, USA: IGI Global, 2020, pp. 209–238.
UMAIR MUNEER BUTT received the B.S. degree
in CS from GIFT University, Pakistan, in 2012, and
the M.S. degree in CS from the National University
of Sciences and Technology (NUST), Pakistan,
in 2016. He is currently pursuing the Ph.D. degree
with the School of Computer Science, Universiti
Sains Malaysia (USM).
He has more than three years of teaching and
research experience in the ﬁeld of data mining,
machine learning, data science, and image pro-
cessing. During his career, he has published seven journals, ﬁve conferences,
and one book chapter. He has served as a Research Associate for three
years and worked on different real-world applications. His current research
interests include data science, data mining, and machine learning.
SUKUMAR LETCHMUNAN received the Ph.D.
degree in computer science from the University of
Strathclyde, U.K., in 2013.
Since 2013, he has been a Senior Lecturer with
the School of Computer Sciences, University Sains
Malaysia (USM). He has been a Tutor and a Tech-
nical Trainer and served as a Lecturer and the
Course Coordinator at private college and private
university prior to his Ph.D. studies. His research
interests include software engineering, software
metrics in web applications, software cost estimation, service-oriented soft-
ware engineering, and agile project management.
FADRATUL HAFINAZ HASSAN received the
Ph.D. degree in computer science (CS) from the
School of Information Systems, Computing and
Mathematics, Brunel University London, West
London, in 2013. She is currently a Senior Lecturer
with the School of Computer Sciences, Univer-
siti Sains Malaysia. Her research involved study-
ing pedestrian simulation models in the urban
planning domain with the School of Architecture,
Design and Planning, The University of Sydney.
Her research interests include artiﬁcial intelligence (AI) for pedestrian sim-
ulation and spatial layout optimization. She has coauthored over 30 publica-
tions and secured ten research grants, ﬁve as principal investigators and ﬁve
grants as co-investigators.
MUBASHIR ALI received the B.S. degree in com-
puter science from Allama Iqbal Open University,
Islamabad, Pakistan, in 2011, and the M.S. degree
in software engineering from Bahria University,
Islamabad, in 2014. He is currently pursuing the
Ph.D. degree with the School of Engineering and
Applied Sciences, University of Bergamo, Italy.
His research interests include NLP, machine learn-
ing, data science, social media analysis, and soft-
ware repository mining. He has authored over
ten publications in international journals and conferences. He has also
served as a Software Engineer for more than ﬁve years in research and
development-based public sector organizations in Pakistan.
ANEES BAQIR received the B.S. degree in infor-
mation technology from the University of Gujrat
and the M.S. degree in information technology
from The University of Lahore. He is currently
working as a Faculty Member at the University
of Sialkot, Pakistan. His research interests include
data mining, machine learning, NLP, data science,
and social media analysis.
HAFIZ HUSNAIN RAZA SHERAZI (Member,
IEEE) received the B.S. and M.S. degrees in com-
puter science from COMSATS University, Lahore,
Pakistan, in 2011 and 2013, respectively, and the
Ph.D. degree in electrical and information engi-
neering from the Politecnico di Bari, Italy, in 2018.
He was an Assistant Professor with GIFT Uni-
versity and an Adjunct Professor with Superior
University, Pakistan, in Spring 2020. He was a
Postdoctoral Researcher with the Department of
Electrical and Information Engineering, Politecnico di Bari, from Novem-
ber 2018 to October 2019. He has been on a research exchange at the
University of Glasgow, U.K., from May 2017 to January 2018. He is cur-
rently a Researcher with the Tyndall National Institute, University College
Cork, Cork, Ireland. Several articles in prestigious conferences and jour-
nals are on his credit. His teaching and research interests include energy
harvesting-low power wide area network technologies for the future IoT,
intelligent transportation systems and applications, and QoS improvement
of advanced cellular infrastructures. He has been an Active Member of
Italian Chapter of the IEEE Computer Society. He received fellowship from
COMSATS University for his B.S. and M.S. studies and the Ministerial
Fellowship for his Ph.D. studies. He is an Editor of Internet Technology
Letters, a reviewer of several top ranked journals, and a TCP Member of
many renowned conferences.
166574
VOLUME 8, 2020
