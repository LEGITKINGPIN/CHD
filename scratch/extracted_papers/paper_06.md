--- Page 1 ---

2020 3rd International Conference on Computing, Mathematics and Engineering Technologies (iCoMET)
Evaluating the Performance of Hierarchical
Clustering algorithms to Detect Spatio-Temporal
Crime Hot-Spots
1st Anees Baqir
Faculty of Computing and IT
University of Sialkot
Sialkot, Pakistan
anees.baqir@uskt.edu.pk
2nd Sami ul Rehman
Faculty of Computing and IT
University of Sialkot
Sialkot, Pakistan
sami ul rehman@outlook.com
3rd Sayyam Malik
Faculty of Computing and IT
University of Sialkot
Sialkot, Pakistan
sayyam.malik@uskt.edu.pk
4th Faizan ul Mustafa
Faculty of Computing and IT
University of Sialkot
Sialkot, Pakistan
faizan.mustafa@uskt.edu.pk
5th Usman Ahmad
Faculty of Computing and IT
University of Sialkot
Sialkot, Pakistan
ahmad.usman@uskt.edu.pk
Abstract—The constant growth in urbanization is a cause of
signiﬁcant social and economical transformations in urban areas.
Areas where crime rates are above the normal level, are known
as crime hot-spots. The increase in urban population is posing
challenges related to the management, services and safety from
criminal activities. It is important to keep an eye on criminal
activities and for the law enforcement agencies, being able to
provide much needed safety of public is an increasingly complex
task. This complex task can be handled by new technologies
which can help these agencies to effectively analyze and under-
stand the different crime trends and patterns with respect to
their geographic locations. This paper uses Hierarchical Density-
based spatial clustering of applications with noise (HDBSCAN)
to ﬁnd spatio-temporal crime hot-spots by clustering and the
results shows that this technique outperforms others.
Index Terms—Hot-spot detection, Clustering, Hierarchical
Clustering, Agglomerative Clustering, HDBSCAN
I. INTRODUCTION
Among other different common social problems, crimes
severely affects the living standard of life and derail social and
economical development of a society [1]. While planning to
move to a new city or traveling to a new location, crimes rate
of that location is considered an important factor in decision
making [2]. Due to gradual increase in crime rates, the need of
hour of law enforcement agencies is to improve crime analytic
by using new data mining approaches, hence providing better
protected and safer communities [3].
Because of the constant growth in urbanization, 21st Century
can be referred as the ”Century of City”, it shows that gradual
978-1-7281-4970-7/20/$31.00 ©2020 IEEE
migration into urban areas is underway [4]. Among other
challenges being faced due to growth in urbanization, causing
social problems and compromising public safety, health, child
development and education, crime spiking is becoming one of
the most important social problems [5] [6]. Fig. 1 shows the
crime spikes over the years in the city of New York [7].
Fig. 1. Crime Spikes over the years in NYC
In order to over come the crime spiking, effective policies
needs to be in place. For this purpose, predictive policing is
the one of the ﬁrst which uses analytical techniques either
to identify the current crime dense areas or to ﬁnd out the
likely places where crimes could occur [8]. Using statistical
techniques, a crime scene can lead us to the type of crime,
perpetrator, victim and location of that crime in future. Higher
crime rates increased complexities, which led to the new

--- Page 2 ---

technologies helping police to analyze and understand crime
trends and patterns [9]. It is well known in this context that
criminal incidents are not distributed uniformly within a city.
It can be understood that crime can be a location-speciﬁc
characteristic, and some locations may possess higher crime
risk than others [10]. Hence, crime is not distributed randomly
or uniformly within a city [11]. In this regard, mapping of
crime hot-spots can help understand the reasons behind the
frequent occurrence of crimes in those areas. This is a crucial
factor for both citizens and law enforcement agencies. Because
for the former, it is an important decision to move to a certain
place and settling there, and for the latter, effective policies
needs to be in place to be able to control and counter the
crimes.
Different types of crimes and overall perception of the
safety of citizens in a city are major factors that directly
plays a role in quality of the lives of residents. Certain types
of criminal incidents such as larceny, identity theft or even
pick-pocketing can be a cause of distress in a person’s life
and affects his well-being. Criminology develops and studies
different theories regarding criminal behavior from different
perspectives to address these issues. It is understood from [7]
that frequency of different types of criminal incidents are not
distributed uniformly. Different types of crimes occurred in
NYC over the span of more than 10 years, with their frequency
counts are show in the following ﬁgure.
Fig. 2. Frequency distribution of different criminal events in NYC
Hot-spot mapping has emerged as an analytical technique
for identifying places with higher risk to appropriately allo-
cate police resources and to perform effective interventions
[12] [13]. An experimental evaluation of relevant methods,
including point mapping, grid thematic mapping, standard de-
viation spatial ellipses, kernel density estimation and thematic
mapping of administrative units has been presented [12].
Considering the threats and challenges imposed by crimes,
this study aims to ﬁnd the crime hot-spots using DBSCAN
and HDBSCAN and compares the results of both techniques
in terms of seconds taken to make the clusters on the dataset
of 100k instances. The dataset being used is provided by the
Gov. of the City of New York [7].
The rest of paper is organized as follows. Section II dis-
cusses the Literature Review, Methodology and Results are
mentioned in section III and IV respectively. The ﬁndings are
concluded in section V.
II. LITERATURE REVIEW
Prevention of crimes have always been an important prob-
lem for everyone in the society. It has gained a lot attraction
not only from government, but from academia as well and both
have been on their toes to provide most effective and viable
solutions. Extensive studies of criminal justice depicts that the
distribution of criminal events within a city are not equal [9].
Crime rates can vary according to geographic location, some
areas can be identiﬁed as low-risk and high-risk areas. The
trends of crimes can change with seasonal patterns and time
of the year as well.
Considering
crime
a
location-speciﬁc
characteristic,
analyzing the crime with respect to location, has grown
in last decade. Among other approaches, hot-spot analysis
is considerable important and popular approach [14] [15]
[16] [17]. For this purpose, point pattern analysis [18], [19]
and clustering [20] is commonly used. Another method is
the discovery of trends and patterns using some knowledge
discovery and data mining techniques [21], such as association
rule mining [22], text mining and spatial analysis [18], and
self-organizing maps [23]. It is found from the studies that
in some locations, the perception of crime is, in fact, higher
than the actual risk level [24].
[25] worked on thefts and robberies data of Shanghai, 2009,
to identify hot-spots using ArcGIS9.3. By analyzing the
hot spots detected from the data of theft and robbery, it
was found that central city edge zone, suburban areas and
central city core area of the city is a crime cold spot in
most of the seasons. [26] performed comparative analysis
using number of techniques including the Besag and Newell
statistic, Geographical Analysis Machine, and Killdorff’s
spatial scan statistics. It was found out that the size and
locations of the detected clusters are sensitive to the chosen
parameters of each method by working on criminal. In [27],
Hot Spots prediction model based on mixed spatial-temporal
characteristics was used on the data of main city zone of
Nanchang ranging from 2014 to 2015. It was found that
optimal performance can be achieved by the prediction model
if crime statistics are conducted on weekly basis.
[28] used number of techniques i.e. Spatio-Temporal Neural
Network (STNN), Decision Tree, Guassian Naive Bayes,
Random Forest, K-nearest neighbors, Logistic Regression,
Multi-layer perception. It was found that STNN outperformed
others with 81.50% accuracy. These techniques were applied
on call-for-service data provided by the Portland, Oregon
Police Bureau (PPB) for a 5-year periof from March 2012
through the end of December 2016. Similarly, [29] used
Random Forest on Data of 12 years, 2003 to 2015, San
Francisco (US), of crime records and on one from Natal
(Brazil) with 10 years (2006-2016) of crime records. As
per the ﬁndings, features such as street network contains

--- Page 3 ---

important information regarding crime based activities. In
[30], Kernel Density Estimation (KDE) was applied on data
regarding crimes occurred in Manila, Philippines from the
year 2012 to 2016. From the results, it was concluded that
criminal activities in Manila are at peak around 8:00 PM to
4:00 AM.
Authors of [31] used spatio-temporal kernel density estimation
(STKDE) on the data of residential burglaries in Baton Rouge,
Louisiana in 2011. It was found that Southwest area of Baton
Rogue
is
the
high-risk
area.
Similarly,
spatio-temporal
ordinary kriging was used in [32], on the data set of crimes
occured in Philadelphia from January 2011 to December
2016 and the it was concluded that the technique secured
90.52% sensitivity.
[9] used DBSCAN on the crimes dataset of New York city
and Chicago and achieved signiﬁcant results. [33] secured
72% accuracy by detecting the hot-spots on data from three
different geographical areas from Sweden i.e. Stockholm,
Gothenburg and Malmo. They used Kernel Density Estimation
(KDE) Spatial Mapping Technique to do so. Similarly, [34]
applied Network based KDE on the crime reports of 2012,
Faisalabad, Pakistan. After the detection of the hot-spots, it
was found that there was a signiﬁcant decrease in crimes of
those areas. [35] applied apriori algorithm on two different
real-world crimes datasets for Denver, CO and Los Angeles,
CA and found hot-spots.
III. METHODOLOGY
The dataset used in this study is Crimes Dataset of NYC
[7]. It comes from data.cityofnewyork.us, a website for open
data about different disciplines concerning the city of New
York, USA. It is in CSV format, containing instances as
crimes reported over the years. The dataset is comprised of
35 attributes. Two of them are Latitude and Longitude which
will be used for clustering as they point to the location on
which the crime was committed.
The following image depicts the steps performed in this paper
to ﬁnd the hot-spots.
Fig. 3. Methodology
First of all, pre-processing is performed on the data to
deal with missing values and outliers. All those data points
which didn’t represent the locations from NYC, were identiﬁed
and removed. And to handle the missing values, FillByMean
method was used, because the outliers were removed, therefore
the mean will always point to within the region of interest.
Because to perform clustering, there cannot be any null values.
To perform clustering, two Hierarchical Clustering algorithms
are used. (A) Hierarchical Agglomerative Clustering (HAC)
and
(B) Hierarchical Density-based spatial clustering of
applications with noise (HDBSCAN). As both algorithms are
implemented in Python, both used euclidean distance for
distance calculations, while HAC’s default number of clusters
are 2 but 6 were mentioned and computed with ward linkage
method because ward minimizes the variance of the clusters
being merged. And HDBSCAN’s default number of minimum
clusters to be computed are 5, we mentioned 6 with 350
minimum samples which is the number of samples in a
neighborhood for a point to be considered a core point.
A. Hierarchical Agglomerative Clustering
Agglomerative clustering is very common type of hierarchi-
cal clustering that is used to group objects in clusters based
on their Similarities. It is a bottom-up clustering in which
we assign. each object to its own cluster. N this technique
we join the two most similar clusters between each cluster
to computer the similarity and repeat the steps until there is
only single cluster left. Before any clustering is performed, a
distance function is used to determine the proximity matrix
containing the distance between each point. It should be
understood that number of clusters that are to be computed,
must be mentioned. Following are the steps below to perform
agglomerate hierarchical clustering.
• Preparation of data.
• Computation of dis-similarity information between every
part of objects in the data set to make each data point to
be a cluster
• Repeat: Using Linkage functions to group objects into
hierarchical cluster tree that based on the distance in-
formation generated at step1. By using that Linkage
functions objects and clusters are in close proximity are
now Linkage together.
• Determining from where to cut the hierarchical tree into
cluster until only single cluster remain.
These steps were performed on the dataset with 100k data
points of two aforementioned attributes, using Google Colab
as it provides up to 25GB of RAM. The algorithm was applied
in Python, using the default parameters. HAC has a time
complexity of O(n3) and it requires O(n2) memory. Hence,
it could perform the clustering on up to 55k data points,
because to perform calculations on data points more than 55k,
it requires RAM more than that. The algorithm was performed
initially on 10k data with an interval of 10k.
B. HDBSCAN
HDBSCAN is a famous clustering algorithm. It is the
extended form of DBSCAN by converting it into a hierarchal
clustering algorithm and then by using a technique to extract
a ﬂat clustering. HDBSCAN is a notebook that provides an
overview of how the algorithm works. HDBSCAN is a library
that contains the suit of tools to use unsupervised learning
to ﬁnd clusters or a deep region of dataset. To perform the
computations, minimum number of clusters Following are the
steps for HDBSCAN.
• Transformation of the space according to the density.

--- Page 4 ---

• Creating the minimal spanning tree of the distance
weighted graph.
• Build a cluster hierarchy of connected components.
• Summarize the cluster hierarchy based on minimum
cluster size
• Extraction of stable clusters from the summarized tree.
The algorithm was applied on aforementioned data points.
IV. RESULTS
Considering the memory requirement of HAC and its time
complexity, the results shows that HDBSCAN performed
better in terms of time required to perform clustering. It
must be noted that, on the basis of data points, HDBSCAN
forms number of clusters, while in HAC, you have to men-
tion K number of clusters. Moreover, HAC could perform
calculations on upto 55k data points only consuming more
than 107 seconds and occupying almost 23GB RAM, while
HDBSCAN performed the calculations on 100k data points
in approximately 7 seconds. The results in terms of time
required to perform clustering, clearly shows that HDBSCAN
outperformed HAC in terms of memory and time requirement
on numerical data points.The performance of HAC in terms
of seconds required to performed calculations is shown in Fig.
4 below.
0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9
1
·105
0
10
20
30
40
50
60
70
80
90
100
110
Data Points
Time in Seconds
Time taken by HAC to perform clustering
HAC
HDBSCAN
Fig. 4. Performance of HAC
Moreover, Fig. 5 shows the clusters computed by HAC on
55k data points, and Fig. 6 shows the clusters computed by
HDBSCAN on 100k data points.
V. CONCLUSION
This paper presented a comparative analysis of two hierar-
chical clustering algorithms to detect crime hot-spots in urban
areas. The algorithms were applied on the data set of New
York City which resulted in ﬁne-grained information about
where criminal events are being occurred frequently and this
information can be used to take suitable measures regarding ef-
fective policing and using man power to counter those events.
Moreover, the analysis showed that HDBSCAN outperformed
HAC in terms of time and memory requirements.
Fig. 5. Clusters computed by HAC on 55k Data Points
Fig. 6. Clusters computed by HDBSCAN on 100k Data Points
REFERENCES
[1] A. Bogomolov, B. Lepri, J. Staiano, N. Oliver, F. Pianesi, and A. Pent-
land, “Once upon a crime: towards crime prediction from demographics
and mobile data,” in Proceedings of the 16th international conference
on multimodal interaction.
ACM, 2014, pp. 427–434.

--- Page 5 ---

[2] R. Arulanandam, B. T. R. Savarimuthu, and M. A. Purvis, “Extracting
crime information from online newspaper articles,” in Proceedings of the
Second Australasian Web Conference-Volume 155. Australian Computer
Society, Inc., 2014, pp. 31–38.
[3] A. L. Buczak and C. M. Gifford, “Fuzzy association rule mining for
community crime pattern discovery,” in ACM SIGKDD Workshop on
Intelligence and Security Informatics, 2010, p. 2.
[4] N. Spencer and D. Butler, “Cities: the century of the city,” Nature, vol.
467, no. 7318, pp. 900–901, 2010.
[5] M. A. Tayebi, M. Ester, U. Gl¨asser, and P. L. Brantingham, “Crimetracer:
Activity space based crime location prediction,” in Proceedings of
the 2014 IEEE/ACM International Conference on Advances in Social
Networks Analysis and Mining.
IEEE Press, 2014, pp. 472–480.
[6] H. Wang, D. Kifer, C. Graif, and Z. Li, “Crime rate inference with
big data,” in Proceedings of the 22nd ACM SIGKDD international
conference on knowledge discovery and data mining.
ACM, 2016,
pp. 635–644.
[7] N. O. Data, “NYPD Complaint Data Historic — NYC Open Data,”
https://data.cityofnewyork.us/Public-Safety/NYPD-Complaint-Data-
Historic/qgea-i56i/data, 2019, [Online; accessed 13-June-2019].
[8] W. L. Perry, Predictive policing: The role of crime forecasting in law
enforcement operations.
Rand Corporation, 2013.
[9] C. Catlett, E. Cesario, D. Talia, and A. Vinci, “Spatio-temporal crime
predictions in smart cities: A data-driven approach and experiments,”
Pervasive and Mobile Computing, vol. 53, pp. 62–74, 2019.
[10] R. K. Wortley and L. A. Mazerolle, Environmental Criminology and
Crime Analysis, 2016, vol. 6.
[11] A. Belesiotis, G. Papadakis, and D. Skoutas, “Analyzing and predicting
spatial crime distribution using crowdsourced and open data,” ACM
Transactions on Spatial Algorithms and Systems (TSAS), vol. 3, no. 4,
p. 12, 2018.
[12] S. Chainey, L. Tompson, and S. Uhlig, “The utility of hotspot mapping
for predicting spatial patterns of crime,” Security Journal, vol. 21, no. 1,
pp. 4–28, 2008.
[13] A. Malik, R. Maciejewski, S. Towers, S. McCullough, and D. S. Ebert,
“Proactive spatiotemporal resource allocation and predictive visual ana-
lytics for community policing and law enforcement,” IEEE Transactions
on Visualization and Computer Graphics, vol. 20, no. 12, pp. 1863–
1872, 2014.
[14] M. B. Short, M. R. D’orsogna, V. B. Pasour, G. E. Tita, P. J. Branting-
ham, A. L. Bertozzi, and L. B. Chayes, “A statistical model of criminal
behavior,” Mathematical Models and Methods in Applied Sciences,
vol. 18, pp. 1249–1267, 2008.
[15] G. O. Mohler, M. B. Short, P. J. Brantingham, F. P. Schoenberg, and
G. E. Tita, “Self-exciting point process modeling of crime,” Journal of
the American Statistical Association, vol. 106, no. 493, pp. 100–108,
2011.
[16] M. B. Short, M. R. D’Orsogna, P. J. Brantingham, and G. E. Tita,
“Measuring and modeling repeat and near-repeat burglary effects,”
Journal of Quantitative Criminology, vol. 25, no. 3, pp. 325–339, 2009.
[17] J. Eck, S. Chainey, J. Cameron, and R. Wilson, “Mapping crime:
Understanding hotspots,” National Institute of Justice: Washington DC.,
2005.
[18] M. Helbich, J. Hagenauer, M. Leitner, and R. Edwards, “Exploration of
unstructured narrative crime reports: an unsupervised neural network
and point pattern analysis approach,” Cartography and Geographic
Information Science, vol. 40, no. 4, pp. 326–336, 2013.
[23] S. T. Li, S. C. Kuo, and F. C. Tsai, “An intelligent decision-support
model using fsom and rule extraction for crime prevention,” Expert
Systems With Applications, vol. 37, no. 10, pp. 7108–7119, 2010.
[19] M. A. Andresen and N. Malleson, “Police foot patrol and crime dis-
placement: a local analysis,” Journal of Contemporary Criminal Justice,
vol. 30, no. 2, pp. 186–199, 2014.
[20] A. T. Murray and T. H. Grubesic, “Exploring spatial patterns of crime
using non-hierarchical cluster analysis,” in Crime modeling and mapping
using geospatial technologies.
Springer, 2013, pp. 105–124.
[21] Y. Shi, Z. Chen, and Y. Peng, “A descriptive framework for the ﬁeld
of data mining and knowledge discovery,” International Journal of
Information Technology and Decision Making, vol. 7, no. 4, pp. 639–
682, 2007.
[22] D. E. Brown and S. Hagen, “Data association methods with applications
to law enforcement,” decision support systems, vol. 34, no. 4, pp. 369–
378, 2003.
[24] A. Tseloni, “Fear of crime, perceived disorders and property crime: a
multivariate analysis at the area level [in: Farrell, g., bowers, k., johnson,
s.d. and townsley, m., eds., imagination for crime prevention: essays in
honor of ken pease],” 2007.
[25] Z. Wang, J. Wu, and B. Yu, “Analyzing spatio-temporal distribution of
crime hot-spots and their related factors in shanghai, china,” in 2011
19th International Conference on Geoinformatics.
IEEE, 2011, pp.
1–6.
[26] M. Helbich and M. Leitner, “Evaluation of spatial cluster detection
algorithms for crime locations,” in Challenges at the Interface of Data
Analysis, Computer Science, and Optimization.
Springer, 2012, pp.
193–201.
[27] Q. Zhang, P. Yuan, Q. Zhou, and Z. Yang, “Mixed spatial-temporal
characteristics based crime hot spots prediction,” in 2016 IEEE 20th
International Conference on Computer Supported Cooperative Work in
Design (CSCWD).
IEEE, 2016, pp. 97–101.
[28] Y. Zhuang, M. Almeida, M. Morabito, and W. Ding, “Crime hot spot
forecasting: A recurrent model with spatial and temporal information,” in
2017 IEEE International Conference on Big Knowledge (ICBK). IEEE,
2017, pp. 143–150.
[29] J. Borges, D. Ziehr, M. Beigl, N. Cacho, A. Martins, S. Sudrich, S. Abt,
P. Frey, T. Knapp, M. Etter et al., “Feature engineering for crime hotspot
detection,” in 2017 IEEE SmartWorld, Ubiquitous Intelligence & Com-
puting, Advanced & Trusted Computed, Scalable Computing & Commu-
nications, Cloud & Big Data Computing, Internet of People and Smart
City Innovation (SmartWorld/SCALCOM/UIC/ATC/CBDCom/IOP/SCI).
IEEE, 2017, pp. 1–8.
[30] M. J. C. Baculo, C. S. Marzan, R. de Dios Bulos, and C. Ruiz,
“Geospatial-temporal analysis and classiﬁcation of criminal data in
manila,” in 2017 2nd IEEE International Conference on Computational
Intelligence and Applications (ICCIA).
IEEE, 2017, pp. 6–11.
[31] Y. Hu, F. Wang, C. Guin, and H. Zhu, “A spatio-temporal kernel
density estimation framework for predictive crime hotspot mapping and
evaluation,” Applied geography, vol. 99, pp. 89–97, 2018.
[32] S. S. Deshmukh and B. Annappa, “Prediction of crime hot spots using
spatiotemporal ordinary kriging,” in Integrated Intelligent Computing,
Communication and Security.
Springer, 2019, pp. 683–691.
[33] E. Johansson, C. G˚ahlin, and A. Borg, “Crime hotspots: An evaluation
of the kde spatial mapping technique,” in 2015 European Intelligence
and Security Informatics Conference.
IEEE, 2015, pp. 69–74.
[34] S. Khalid, J. Wang, M. Shakeel, and X. Nan, “Spatio-temporal analysis
of the street crime hotspots in faisalabad city of pakistan,” in 2015 23rd
International Conference on Geoinformatics.
IEEE, 2015, pp. 1–4.
[35] T. Almanie, R. Mirza, and E. Lor, “Crime prediction based on crime
types and using spatial and temporal criminal hotspots,” arXiv preprint
arXiv:1508.02050, 2015.
