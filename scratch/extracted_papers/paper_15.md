--- Page 1 ---

Received 10 April 2023, accepted 11 June 2023, date of publication 14 June 2023, date of current version 20 June 2023.
Digital Object Identifier 10.1109/ACCESS.2023.3286344
Crime Prediction Using Machine Learning and
Deep Learning: A Systematic Review
and Future Directions
VARUN MANDALAPU
1, LAVANYA ELLURI
2, (Member, IEEE),
PIYUSH VYAS2, AND NIRMALYA ROY1, (Member, IEEE)
1Department of Information Systems, University of Maryland Baltimore County, Baltimore, MD 21250, USA
2Subhani Department of Computer Information Systems, Texas A&M University—Central Texas, Killeen, TX 76549, USA
Corresponding authors: Varun Mandalapu (varunm1@umbc.edu) and Lavanya Elluri (elluri@tamuct.edu)
ABSTRACT Predicting crime using machine learning and deep learning techniques has gained considerable
attention from researchers in recent years, focusing on identifying patterns and trends in crime occurrences.
This review paper examines over 150 articles to explore the various machine learning and deep learning
algorithms applied to predict crime. The study provides access to the datasets used for crime prediction by
researchers and analyzes prominent approaches applied in machine learning and deep learning algorithms to
predict crime, offering insights into different trends and factors related to criminal activities. Additionally,
the paper highlights potential gaps and future directions that can enhance the accuracy of crime prediction.
Finally, the comprehensive overview of research discussed in this paper on crime prediction using machine
learning and deep learning approaches serves as a valuable reference for researchers in this field. By gaining
a deeper understanding of crime prediction techniques, law enforcement agencies can develop strategies to
prevent and respond to criminal activities more effectively.
INDEX TERMS Crime prediction, crime detection, crime datasets, deep learning, machine learning, smart
policing, survey.
I. INTRODUCTION
Crime prediction is a complex problem requiring advanced
analytical tools to effectively address the gaps in existing
detection mechanisms. With the increasing availability of
crime data and through the advancement of existing tech-
nology, researchers were provided with a unique opportu-
nity to study and research crime detection using machine
learning and deep learning methodologies. Based on the
recent advances in this field [1], [2] [3], this article will
explore current trends in machine learning and deep learning
for crime prediction and discuss how these cutting-edge
technologies are being used to detect criminal activities,
predict crime patterns, and prevent crime. Our primary
goal is to provide a comprehensive overview of recent
The associate editor coordinating the review of this manuscript and
approving it for publication was Rongbo Zhu
.
advancements in this field and contribute to future research
efforts.
The field of machine learning is a subset of artificial
intelligence that uses statistical models and algorithms to
analyze and make predictions based on data. On the other
hand, deep learning methods are a subset of machine learning
that uses artificial neural networks with multiple layers to
model complex relationships between inputs and outputs [4].
Both machine learning and deep learning methodologies have
the potential to be applied to the problem of crime prediction
in many ways [5].
Machine learning algorithms have been utilized in crime
prediction to analyze crime data and predict future crime
patterns [6]. For example, algorithms like decision trees,
random forests, and support vector machines have been
trained on crime data from specific cities to predict crime
patterns accurately [7]. Apart from predicting crime pat-
terns, these algorithms can provide valuable insights into
VOLUME 11, 2023
This work is licensed under a Creative Commons Attribution 4.0 License. For more information, see https://creativecommons.org/licenses/by/4.0/
60153

--- Page 2 ---

V. Mandalapu et al.: Crime Prediction Using ML and DL: A Systematic Review and Future Directions
crime trends and patterns. These capabilities allow for
deploying resources and tactics to combat crime effectively.
Additionally, machine learning algorithms can also be used
to identify correlations between crime incidents and various
environmental and demographic factors such as location,
weather, and time of day [8]. This information can be used to
develop crime prediction and prevention strategies suitable to
a given community’s specific needs.
Predictive policing is also a significant application of
machine learning for crime prediction [9]. Predictive policing
refers to using data and analytics to inform law enforcement
efforts and reduce crime. Machine learning algorithms can be
used to analyze crime data from a specific geographic area,
such as a city or neighborhood, to identify crime hotspots
and predict future crime incidents. This information can then
be used to direct policing resources to areas where they are
most needed, increasing the effectiveness of law enforcement
efforts.
Deep learning algorithms, such as convolution and recur-
rent neural networks, have also shown promise in crime
prediction. These algorithms have been trained on crime data
with either a spatial or temporal component to accurately
predict crime patterns in specific cities. For example, deep
learning algorithms have been used to analyze crime data,
including the time, location, and type of crime incidents [10].
This information is used to create a predictive model that can
be used to identify potential crime hotspots and predict future
crime incidents.
Another application of deep learning in crime prediction
is computer vision and video analysis. This technology has
been used to analyze video footage from surveillance cameras
to detect and classify criminal activities, such as vandalism,
theft, and assault [1]. The advanced deep learning models
are also integrated with drones and other aerial technologies
to provide new opportunities to monitor and respond to
criminal activities. These algorithms have also been used
to analyze crime data from multiple sources, including
crime reports, social media, and police records, providing
a more comprehensive view of criminal activities [11].
By automating this process, deep learning algorithms have
the potential to enhance the ability to identify and respond to
crime in real-time, providing a crucial tool in the fight against
criminal activity.
Despite the promise of machine learning and deep
learning for crime prediction, several challenges must be
addressed. One of the biggest challenges is the availability
of high-quality crime data. Crime data can be difficult to
obtain, and the available data may need to be completed
or reliable. Additionally, collecting and using crime data
is associated with privacy and ethical concerns. These
challenges must be addressed to fully realize the potential
of machine learning and deep learning for crime prediction.
Another challenge is the interpretability of machine learning
and deep learning models. These models can be challenging
to understand and interpret, limiting their usefulness in
decision-making. To effectively apply these models to the
problem of crime prediction, it is vital to develop inter-
pretable models that can provide clear explanations of their
predictions.
Moreover, the recent advancements in machine learning
and deep learning for crime prediction show great promise in
addressing this complex problem [12]. However, significant
challenges remain, and much work is still needed to realize
these technologies’ potential fully. This research article
provides a comprehensive overview of recent trends in this
field and offers insights into the potential applications of
machine learning and deep learning for crime prediction.
By highlighting the potential of these technologies and
the challenges that must be addressed, this research article
contributes to the broader research community. It advances
our understanding of the role of machine learning and deep
learning in crime prediction. Hence, the key contributions
of this work are as follows:- first, this paper provides the
amalgamation of existing studies that utilized state-of-the-
art machine learning and deep learning-based approaches
in the realm of detecting neighborhood crime. Thereby
extending the fathomable literature knowledge base. Second,
this paper eliminates the limitation of the scarcity of potential
datasets availability. We have highlighted distinct publicly
available datasets related to neighborhood crime prediction
that existing studies have utilized. Thereby archiving the data
resources for future scholars. Third, this work drafted future
research directions to eliminate the existing research gaps in
neighborhood crimes. Thereby reasonably providing future
research objectives/questions to the research community to
pursue further.
II. RESEARCH METHODOLOGY
The primary research aims to find various efficient algorithms
for predicting neighborhood crimes. In our previous work [8],
we used statistical analysis to predict the crimes in Newyork
city. Our paper got good attention from the researchers, so we
wanted to look for the efficient machine learning and deep
learning approaches used in this area. We have followed
a systematic approach to select the papers for this review.
As part of this research, we have considered the papers from
multiple databases related to predicting crime.
For this review, we have considered all the primarily used
terms in the papers focused on predicting crimes. To include
all the possible alternative words of each term, we have used
‘‘*’’ as a wild character for IEEE and ACM databases so
that it contains zero or more characters after the string. The
main target of this review is to check for all the existing
research works to predict crime. In addition, we want to help
the research community by identifying the different datasets
used to apply the algorithms. Irrelevant studies are removed
by applying multiple filters to our search queries. We also
selected 30 papers to be part of the main text based on
relevance and novelty, and 20 more papers are added in the
appendix Table 7. In this survey, we have used a combination
of an automated and manual search shown in Figure 2. In the
initial stages, we focused on using the automatic digital
60154
VOLUME 11, 2023

--- Page 3 ---

V. Mandalapu et al.: Crime Prediction Using ML and DL: A Systematic Review and Future Directions
FIGURE 1. Research paper selection methodology.
search. In the final step, we manually read the entire paper
to select a set of documents in machine learning and deep
learning areas.
Firstly, we have identified the key terms to create the
queries. We then used those keywords to construct the various
research database-related queries based on respective syntax.
Below are the queries used to explore IEEE, Science Direct,
and ACM databases.
IEEE query:
((‘‘Document Title’’: ‘‘crime*") AND (‘‘Document Title":
‘‘predic*" OR ‘‘Document Title": ‘‘detec*" OR ‘‘Document
Title": ‘‘recogni*" OR ‘‘Document Title": ‘‘machine learn-
ing" OR ‘‘Document Title":‘‘deep learning" OR ‘‘Document
Title":‘‘clustering" OR ‘‘Document Title":‘‘natural language
processing"))
Science Direct Query:
(‘‘crime") AND ( ‘‘prediction" OR ‘‘detection" OR
‘‘recognition" OR ‘‘machine learning" OR ‘‘deep learning"
OR ‘‘clustering" OR ‘‘natural language processing")
ACM Query:
‘‘query": { Fulltext:((‘‘crime*") AND ( ‘‘predic*" OR
‘‘detec*" OR ‘‘recogni*" ‘‘machine learning" OR ‘‘deep
learning" OR ‘‘clustering" OR ‘‘natural language process-
ing")) }
A. DATA COLLECTION
We focused on looking into individual research libraries
rather than searching in google scholar. Because google
scholar will have data from all these databases, there could
be duplicates. Below are the database library homepage links
where the research works were extracted using the keywords
mentioned in search queries. Initially, we searched using
all the metadata attributes available on each database. Next,
we applied the filters only on the full-text papers. As we
noticed that the number of documents is still high, we applied
the filter on the index terms used in the article as the results
will be more relevant. We have more than 450 papers from all
the databases at this stage. Finally, in the last step, we applied
the filter on the document title, where the total number of
papers was 157.
a) Science-Direct Elsevier (https://www.sciencedirect.com)
FIGURE 2. Steps involved for typical crime detection.
b) ACM (DL) Digital Library (https://dl.acm.org)
c) IEEE Xplore Access Digital Library (https://ieeexplore.
ieee.org)
After applying the automated filters as shown in Figure 1,
all the authors manually divided the work and read the papers
to select the final set. For the selection, we mainly looked
into the essential elements like the focus or objective of the
article, datasets that authors have used, algorithms applied,
and the accuracy rates. The focus of this survey is not only
to help the community know the various algorithms applied
but also to let them know about the datasets they can use
to apply the novel algorithms and get the results for their
research.
III. LITERATURE ANALYSIS
A. PRE-ASSESSMENT LITERATURE ANALYSIS
An analysis of collected literature data from the distinct
research databases is essential [13] to receive information
VOLUME 11, 2023
60155

--- Page 4 ---

V. Mandalapu et al.: Crime Prediction Using ML and DL: A Systematic Review and Future Directions
FIGURE 3. Research publication trends from 2018-2022.
FIGURE 4. Distribution of article’s page counts.
regarding the growth of an adopted research domain, scope
across the research community, and popularity among the
existing researchers. Thus, we have performed a detailed
analysis of the collected literature data. We did pre-analysis
and post-analysis, wherein pre-analysis comprises the explo-
ration of initially collected literature ( i.e., the research
papers that were collected immediately after performing our
search query), and post-analysis comprises the investigation
of those study’s data that were finally selected after applying
selection criteria. Although we have exhumed the two
renowned research databases, IEEE and Science Direct,
lately, it has been observed that Science direct discontinued
the search result extraction. Hence following analytical
charts are based on IEEE databases findings. Figure 3
shows the research publication trends in neighborhood crime
from 2018 to 2022 (i.e., the last five years). It showed upward
trends from 2018 to 2021 and downward trends during 2022.
The years 2020 and 2021 are the apexes of COVID-19, which
could be why existing researchers have utilized that time to
explore more neighborhood crime research.
Figure 4 indicates the distribution of article page counts
for the neighborhood crime research. The majority of articles
(i.e., 46) comprise five pages. This may be because many
researchers have published their work in conferences and
symposiums rather than journals. Figure 4 depicts that
very few articles comprise more than ten pages. Since
conferences, seminars, workshops, and symposiums allowed
the presentation of abstracts and short papers, this Figure 4
also depicts the 1,2,3 page-long articles.
FIGURE 5. Distribution of article’s citations.
FIGURE 6. Distribution of research articles at various venues.
To assess the popularity of the neighborhood crime
research articles, we have also performed the citation
analysis shown in Figure 5. Wherein the conference papers
have gained more citations (60) than the other journals
(10 citations), chapter (1 citation), seminar (0 citations),
symposium (3 citations), and workshop (o citation) articles in
the neighborhood crime area, this may be because this area is
less popular among the researchers.
Figure
6,
shows
the
distribution
of
neighborhood
crime-related articles published in various venues. Wherein
this figure depicts the venue name (e.g., conference, journal,
etcetera), number of papers (i..e, in numeric value-1,7..), and
percentage of published articles (i.e., 1%, 82%,..). Here, the
majority of papers have been published in the conferences
than the other venues like journals, workshops, symposiums,
and seminars. In the neighborhood crime area, 82% of the
articles were published in conferences, followed by 9% in
the journal, 4% in the symposium, 3% in book chapters,1%
in seminars, and 1% in workshops.
B. POST-ASSESSMENT LITERATURE ANALYSIS
To enhance the understanding of the neighborhood crime
domain in combination with our above-cited selection cri-
teria, we have also performed the post-assessment literature
analysis because this is the crux of our literature survey to
fulfill our identified objectives. We have created a word cloud
for Neighborhood crime-related papers to fathom further the
selected papers’ underlying key concepts or themes. A word
60156
VOLUME 11, 2023

--- Page 5 ---

V. Mandalapu et al.: Crime Prediction Using ML and DL: A Systematic Review and Future Directions
FIGURE 7. Word cloud on selected articles.
FIGURE 8. Distribution of neighborhood crime-related selected article’s
technique types.
cloud often called a tag cloud, is a graphic depiction of the
terms that appear the most frequently in a given text. Each
word’s magnitude in the word cloud reflects how frequently
it appears in the text. Word clouds are frequently employed in
literature reviews to swiftly pinpoint the key themes or topics
within a sizable body of material. Additionally, they can be
used to compare various texts and find trends and patterns in
the data [14]
Figure 7 shows the word cloud for the neighborhood
crime-related selected articles wherein many crime-related
key terms have emerged as trends in the existing stud-
ies. ‘‘crime’’, ‘‘criminal’’, ‘‘policing’’, ‘‘enforcement’’, and
‘‘security’’ are the words that indicate the emphasis of
researchers on the sub-areas of crime detection. Moreover,
‘‘prediction’’, ‘‘algorithms’’, and ‘‘techniques’’ are the words
that indicate the aim of the existing studies. This word cloud is
aligned with our selection criteria and objectives that further
validate our final set of selected articles for this literature
review study.
Figure
8
shows
the
Distribution
of
neighborhood
crime-related selected article’s technique types among
Science Direct and IEEE databases, respectively. As shown
in the Figure 8, among the neighborhood crime-related
articles, machine learning (ML), the combination of machine
learning and deep learning (DL), and the combination of
machine learning and natural language processing (NLP), the
combination of DL and NLP, and DL are the majorly used AI
technique type. In the neighborhood crime domain – 67% of
articles have used ML, 21% have used DL, 8% have used the
FIGURE 9. Distribution of neighborhood crime-related selected article’s
technique’s classes.
combination of ML and DL, 2% have used the combination
of DL and NLP, and 2% have used the combination
of ML and NLP. It has been observed that machine
learning techniques are popular in the neighborhood crime
area.
Figure
9
shows
the
distribution
of
neighborhood
crime-related selected article’s technique classes among
Science Direct and IEEE databases. As shown in Figure 9,
among the neighborhood crime-related articles, the classi-
fication task is the prime focus utilizing various ML and
DL-related techniques. In the neighborhood crime domain
– 63% of articles have focused on the classification task,
29% have focused on the regression tasks, 6% have focused
on the clustering task, and 2% of the studies have utilized
the combination of classification and clustering. It has been
observed that the Classification task is the prime focus of the
studies on neighborhood crime.
Figure 10 shows the Distribution of neighborhood Crime
related selected article’s Technique classes Versus technique
Type among Science Direct and IEEE databases. Figure 10
answers the question- what AI Technique is used for which
technique classes (classification, clustering, and regression)?
Herein all five techniques (ML, DL, DL+NLP, ML+NLP,
and ML+DL) have been used for the classification task
whereas, for clustering and the combination of clustering
and classification, the ML is solely used. In neighborhood
crime articles NLP is also used for classification and
regression tasks in addition to ML and DL. For the
classification and regression tasks ML and DL both have been
used.
IV. CRIME PREDICTION PROCESS & DATASETS
Crime prediction using machine and deep learning involves
several major steps as shown in Figure 11. The first step
is data collection, which involves gathering relevant data
such as crime statistics, demographics, and weather patterns.
The next step is data preprocessing, which includes cleaning
and transforming the data into a usable format. After data
preprocessing, the data is split into training and testing
sets for model development and evaluation. The next step
is feature engineering, which involves selecting relevant
features from the data that can be used to train the model.
VOLUME 11, 2023
60157

--- Page 6 ---

V. Mandalapu et al.: Crime Prediction Using ML and DL: A Systematic Review and Future Directions
FIGURE 10. Distribution of neighborhood Crime related selected article’s Technique classes Versus technique Type.
FIGURE 11. Architecture flow of crime prediction.
Once the features are selected, various machine and deep
learning algorithms can be applied to the data for training and
prediction purposes. Finally, the trained models are evaluated
using various performance metrics to assess their accuracy
and effectiveness in predicting crime. The results can be used
to support decision-making in law enforcement and crime
prevention efforts.
As shown in Table 1, there have been many datasets used in
crime detection and prediction research articles. One example
is the Chicago Crime Dataset, which contains data on crimes
reported in the Chicago area. This dataset has been used to
create models that predict the likelihood of specific types
of crimes occurring in different areas of the city. Another
dataset used in crime prediction research is the London Crime
Dataset, which contains data on crimes reported in London
city. This dataset has been used to create models that predict
the likelihood of crimes occurring in specific areas and their
relationship to the socio-economic factors of people based on
their geo-locations in the area.
Other datasets commonly used in crime detection and pre-
diction research include the Los Angeles Crime Dataset, the
New York City (NYC) Crime Dataset, and the Philadelphia
Crime Dataset. These datasets contain information on crimes
reported in their respective cities and have been used to create
models that predict the likelihood of specific types of crimes
occurring in different areas. In addition to these, there are also
global datasets that focus on CCTV video footage, types of
aggression, and weapons for real-time crime predictions.
Overall, these datasets provide valuable information for
researchers to build crime prediction models that could help
law enforcement agencies prevent and respond to criminal
activities more effectively. The location and access to datasets
used by research articles surveyed in this paper are listed in
Table 1.
60158
VOLUME 11, 2023

--- Page 7 ---

V. Mandalapu et al.: Crime Prediction Using ML and DL: A Systematic Review and Future Directions
TABLE 1. Crime detection papers with data science algorithms.
V. CRIME PREDICTION USING MACHINE LEARNING
TECHNIQUES
Traditional machine learning models have proven to be
effective for crime prediction. Various types of models
such as decision trees, support vector machines, logistic
regression, and random forests have been utilized to analyze
crime data and identify patterns that can be used to predict
criminal activity. Unlike deep learning, which relies on large
amounts of data and complex neural networks, traditional
machine learning models require fewer data points and are
easier to interpret. For example, a logistic regression model
can be used to predict the likelihood of a certain type of
crime occurring based on factors such as time of day, location,
and demographics of the area. A decision tree model can be
used to identify the most important factors that contribute to
the occurrence of a particular crime. Random Forest (RF)
models can be used to analyze a wide range of features
and make predictions about crime patterns. In addition to
these techniques, traditional machine learning models can
also be used for anomaly detection and outlier analysis
in crime data. By identifying unusual patterns or outliers
in the data, law enforcement agencies can detect potential
criminal activity and take action to prevent it. In the below
sections V-1 and V-2, we discuss the latest research on using
machine learning model-based regression and classification
for crime prediction.
1) MACHINE LEARNING BASED REGRESSION METHODS
FOR CRIME PREDICTION
Several crime detection scenarios are predicted using regres-
sion techniques as shown in Table 2. Researchers mainly
focused on prevalent crimes like motorcycle robbery, losing
VOLUME 11, 2023
60159

--- Page 8 ---

V. Mandalapu et al.: Crime Prediction Using ML and DL: A Systematic Review and Future Directions
TABLE 2. Crime prediction using machine learning regression techniques.
property, and crimes in urban areas. Numerous factors
may drive the boom in motorcycle robberies. For example,
population growth and density, commuting conduct, bike
usage, etc. These situations are problems for the police to
govern and screen regularly since it requires forecasting and
probabilities of robbery in a precise term. A novel method is
proposed in the research study [49]; the authors created an
application to predict motorcycle robbery with a technique to
consider outside consequences using ARIMAX – TFM with
a single input. The accuracy of ARIMAX is measured using
Mean Absolute Percentage Error (MAPE) and Root Mean
Squared Error (RMSE), and the scores are 32.30 and 6.68.
Rapid urbanization is a compelling challenge connected
to city management and services. Cites with higher crime
rates are difficult to manage public safety. To reduce crimes,
new technologies are relieving police departments to access
vast amounts of crime data to identify underlying trends
and patterns. These technologies have doubtlessly grown the
efficient deployment of police assets within a given region
and ultimately guide greater powerful crime prevention.
Researchers have worked on predictive models to use these
datasets and predict crimes. Study [23], provides a technique
primarily based on spatial analysis and auto-regressive
fashions to automatically locate excessive-hazard crime areas
in city areas and reliably forecast crime tendencies in each
area. Experiments are performed on real-world datasets
gathered in New York City and Chicago.
Another study [50], compared multiple techniques to
predict the crimes in various areas of a metropolis. This
research explored three predictive models: linear regression,
logistic regression, and gradient boosting. The authors
utilized feature selection techniques to select essential
predictors. By applying feature selection methods, there
is an improvement in accuracy scored, and it helped to
avoid model overfitting. After comparing the results of all
four models, the authors found that the gradient boosting
technique outperformed, proven to be the best method to
predict the crime rate in the urban area.
In another study [51], authors have looked at the crimes
in Brazil, which have increased rapidly in recent times.
Numerous predictive solutions use intelligent systems to
identify when will a criminal offense will arise, which lets
police send to those areas that are in danger. As part of
their research, the authors looked into four machine-learning
approaches for identifying where a criminal offense will
arise in Fortaleza, Brazil. Their results indicate that easy
algorithms are efficient in predicting crime. Also, they have
seen that the Decision Tree and Bagging Regressor strategies
obtained quality prediction outcomes.
As mentioned above, numerous linear models are there
to predict crime through the correlations between urban
metrics and crime. However, due to multicollinearity and
nonGaussian distributions in urban attributes, we usually
tend to make controversial conclusions on these attributes to
predict crime. Ensemble-based machine learning algorithms
can deal with such problems adequately. In the research
work [44], authors applied random forest regressor to predict
the crime and quantify the impact of urban attributes on
homicides. Their approach has 97% accuracy in crime
prediction, and the significance of city indicators is clustered
and ranked equally. Their research identifies the rank of
urban indicators based on their significance in predicting
crime. As per their results, unemployment and illiteracy are
the essential variables for depicting homicides in Brazilian
towns.
2) MACHINE LEARNING BASED CLASSIFICATION METHODS
FOR CRIME PREDICTION
Traditional regression techniques can successfully check the
variables’ significance but, they must be more reliable for
60160
VOLUME 11, 2023

--- Page 9 ---

V. Mandalapu et al.: Crime Prediction Using ML and DL: A Systematic Review and Future Directions
TABLE 3. Crime prediction using machine learning classification techniques.
crime prediction. In many research works [32], [33], [34]
mentioned in section V, authors have proven that machine
learning models effectively predict crimes. Still, they could be
more efficient in identifying which variables are significant
in predicting crimes. We further examined the classification
techniques to predict different criminal incidents like analyz-
ing the criminal reports as shown in Table 3. Studying those
reviews for crime prediction enables regulatory authorities
to deal with crime prevention strategies. However, collecting
these reviews personally and determining their crime types is
challenging. In one study [52] authors have created a novel
approach, an incremental classifier that learns the new data
and dynamically predicts the results. In this research [52],
they have utilized the Bi-objective Particle Swarm Optimiza-
tion technique to develop an efficient incremental classifier
for dynamically classifying and predicting crime reports.
Crime reports from various countries have been collected
from online newspapers to measure the performance of
their classifier. Also, they evaluated the results manually
with unprejudiced police witness narrative crime reports.
They tested their approach on four datasets to measure their
model’s statistical significance.
Another research [53], focuses on predicting crime using
the XGBoost algorithm. Based on the records of theft
instances in H city, they developed an optimized decompo-
sition and fusion method based on XGBoost and applied
multi-class classification models like OVR-XGBoost and
OVO-XGBoost. As the theft datasets have different classes,
they have utilized the SMOTENN algorithm to process
and make data the dataset balanced. Their results show
that OVR-XGBoost and OVO-XGBoost models’ prediction
accuracy is better than the baseline XGBoost models. In the
study [54], the authors have selected 17 variables for crime
prediction, and the XGBoost algorithm is adopted to train
the prediction model. A post hoc interpretable approach,
Shapley additive explanation (SHAP), is used to parent
the contribution of person variables. SHAP, a post hoc
interpretable method, is used to determine the significance
of individual variables. Among all 17 variables used in this
research, the percentage of the non-neighborhood population
and the populace aged 25–44 contribute greater than different
variables in predicting crime. The higher the ambient
population of elderly 25–44 in the vicinity, the more public
crimes. The authors have also validated the SHAP values
to demonstrate each variable’s contribution to the crime
prediction across the experimental findings. These outcomes
of the neighborhood techniques can assist the police in
identifying the most important factors.At the same time, the
global model identifies the essential features of the entire
region.
Another research [55] focuses on predicting crime dur-
ing or after psychiatric care. As modern threat-evaluation
VOLUME 11, 2023
60161

--- Page 10 ---

V. Mandalapu et al.: Crime Prediction Using ML and DL: A Systematic Review and Future Directions
equipment is time-consuming to administer and offers
constrained accuracy, this research looked to expand a
predictive model designed to discover psychiatric patients
liable to commit the crime. The authors utilized the
longitudinal nice of the affected Danish person registries,
recognizing the 45.720 adult patients who had connected
with the psychiatric system in 2014, of which 474 committed
crimes leading to a forensic psychiatric treatment direction
after discharge. Authors have used four gadget studying
models (Random Forest, Logistic Regression, XGBoost,
and LightGBM) over various sociodemographic, judicial,
and psychiatric variables. Their model identified 47% of
future forensic psychiatric patients, making correct pre-
dictions in 57% of samples. This research demonstrates
how a clinically useful preliminary risk assessment is
achieved using machine learning classification techniques.
Their research helps to flag possible forensic psychiatric
patients while in contact with the general psychiatric
system, which allows early intervention initiatives to be
activated.
Another research work [56] presents a graph-based ensem-
ble classification approach for predicting crime reports better
than traditional classifiers. Crime reports are graphically
modeled to locate the maximal independent subset of
features, and then they use decision tree classifiers on this
set. Extensive experiments are performed to compare the
overall performance of the proposed approach on numerous
crime data sets. The developed ensemble classification model
demonstrated better performance. Apart from predicting
crime, researchers [42], [43] also focused on interpreting
crime-related predictions. This will lead to a better under-
standing of what impacts crime detection.
A. CRIME PREDICTION USING DEEP LEARNING
TECHNIQUES
Deep learning has become a popular method for crime
prediction in recent years. The studies included in the
reference research articles use a range of deep learning
algorithms, such as convolution neural networks (CNN),
deep neural networks, and sentiment analysis, to analyze
various types of data, including text, images, audio, and social
media. These algorithms are capable of detecting patterns
and anomalies in the data that can indicate criminal activity.
One of the key strengths of deep learning is its ability to
handle large and complex datasets, making it well-suited to
the task of crime prediction. For example, image analysis
algorithms can detect threatening objects in crime scenes
and predict the likelihood of a crime occurring. Text mining
techniques can be used to analyze crime-related tweets and
make predictions about crime patterns. In addition, deep
learning algorithms can detect anomalies in crime data in
smart cities, which could indicate the presence of criminal
activity. Researchers used these techniques to tackle both
regression and classification problems in crime prediction as
detailed in the below sections.
1) DEEP LEARNING BASED REGRESSION METHODS FOR
CRIME PREDICTION
Deep learning algorithms in regression analysis are used as a
tool for crime prediction to identify the factors most strongly
associated with crime and use these relationships to make
predictions about future crime patterns. The research articles
in this area highlight the strengths of regression in modeling
the relationship between multiple variables, including crime
data, weather data, demographic data, social media data,
and location data. A common theme among these research
articles shown in Table 4 are the use of regression combined
with deep learning techniques, such as convolution neural
networks, recurrent neural networks, attention mechanisms,
and sequential fusion models, to improve the accuracy of
crime prediction.
In research focusing on theft crime prediction [26], the
authors use regression to model the relationship between
theft crime data, demographic data, and weather data.
The regression model adopts two deep learning models,
a Long Short-Term Memory (LSTM) network and a
Spatio-Temporal Graph Convolutional Network (ST-GCN),
to predict the likelihood of theft crimes in urban communities.
The regression model can incorporate external information,
such as weather data, which can influence crime patterns. The
LSTM and ST-GCN models capture the temporal and spatial
dependencies in the data, respectively. In another article [28],
the authors use regression to model the relationship between
crime data, weather data, and social media data. The regres-
sion model is part of a more comprehensive, multi-module
approach that uses attention mechanisms and sequential
fusion models to predict the likelihood of crimes. This
framework consists of four sub-modules, where the initial
two modules adopt St-BiLSTM and ATTN-LSTM to process
temporal and spatial features. Finally, two fusion models
are used to abstract the data and make crime predictions on
Chicago and San Francisco crime datasets.
In another research focused on using spatiotemporal
data [39], the authors use convolutional neural networks to
develop a regression model on publicly available crime data
in Los Angeles. The regression model is part of a more exten-
sive, mixed spatiotemporal neural network that is designed
to make real-time predictions about the likelihood of crimes.
The authors claim that using regression in combination with
the diverse spatiotemporal neural network results in improved
accuracy and real-time performance. Another research [29]
that applies crime risk prediction across different cities uses
regression to model the relationship between crime data and
demographic data from other cities. The regression model
is part of an unsupervised domain adaptation technique
designed to predict the likelihood of crimes in new cities.
The authors claim that using regression in combination with
the unsupervised domain adaptation technique results in
improved accuracy in crime prediction. A recent research
article [57] applied machine learning and deep learning
methods to crime data from Xiaogan, a medium-sized city
60162
VOLUME 11, 2023

--- Page 11 ---

V. Mandalapu et al.: Crime Prediction Using ML and DL: A Systematic Review and Future Directions
TABLE 4. Crime prediction using deep learning regression techniques.
in China, to predict crime hourly. The models use weather,
holiday, time slot ID, and Day of week information to
extract spatial dependency (distance graph, poi similarity,
and crime similarity). Temporal dependencies captured using
GRU are used to predict the number of incidents in different
locations.
These research articles highlight the versatility of regres-
sion as a tool that can be integrated with other techniques
to enhance the performance of crime prediction models.
Another commonality among the papers is the use of
regression to model the relationship between crime data
and other variables, such as weather and demographic data,
to incorporate external information that may influence crime
patterns. This allows for the creation of more comprehensive
and accurate models of crime patterns. In summary, the five
research papers demonstrate the strengths of regression as
a tool for crime prediction, including its ability to model
the relationship between multiple variables, its versatility
in being integrated with other techniques, and its ability to
incorporate external information that may influence crime
patterns.
2) DEEP LEARNING BASED CLASSIFICATION METHODS FOR
CRIME PREDICTION
Deep learning algorithms are trained on large amounts of data
to classify instances into various categories. This makes them
ideal for solving classification problems in crime detection.
Deep learning models can accurately organize criminal
activity and detect criminal intent by analyzing vast amounts
of data, including images, audio, text, and social media
data. For example, image-based data can provide detailed
information about crime scenes, including the presence of
weapons and other objects that may indicate criminal intent.
Similarly, audio-based data can provide valuable insights
into the tone and context of a conversation, helping to
identify potential illegal activities. Another advantage of deep
learning for classification problems in crime detection is the
ability to identify hidden patterns in the data that traditional
methods may miss. For example, deep neural networks can be
trained to analyze crime-related tweets, uncovering patterns
that indicate a potentially criminal act. The results of deep
learning models in crime detection have been awe-inspiring.
The papers reviewed under deep learning classification are
listed in Table 5
In crime-related classification, two main types of deep
learning algorithms are used: Convolutional Neural Networks
(CNN) and Recurrent Neural Networks (RNN). CNN’s
are commonly used in image-based classification tasks,
including crime scene prediction. In the research article
focusing on crime scene data [59], CNNs are trained to
detect threatening objects in crime scenes, such as weapons.
This allows the model to comprehensively analyze the crime
scene, including the presence of things that may indicate
criminal intent. On the other hand, RNN’s are commonly
used to study temporal patterns in data. In a research
article focusing on crime prediction based on behavioral
tracking [40], the authors use a combination of deep learning
algorithms, including CNN and RNN, to analyze behavioral
tracking data and motion analysis data. The study shows that
this approach can effectively predict criminal activities, such
VOLUME 11, 2023
60163

--- Page 12 ---

V. Mandalapu et al.: Crime Prediction Using ML and DL: A Systematic Review and Future Directions
TABLE 5. Crime prediction using deep learning classification techniques.
as theft and robbery, by analyzing patterns in the behavior
and movements of individuals in a given area. In the research
articles [36] focusing on social media data, Artificial Neural
Networks are trained on crime-related text data to predict the
likelihood of a crime occurring. These models analyze the
context and tone of the text data to classify patterns that may
indicate criminal activity.
In addition to the articles mentioned above, several
other research studies [8], [41], [58] have also used deep
learning techniques for crime prediction and classification.
These studies demonstrate the versatility of deep learning
algorithms in crime-related classification tasks, as they can
be applied to a wide range of data types, including images,
text, audio, and social media data. For example, research
focusing on crime anomaly detection [60] uses deep learning
algorithms, including Autoencoders and CNN, to analyze
crime patterns in smart cities. The study shows that this
approach can effectively detect unusual crime patterns, which
may indicate the presence of criminal activity. In another
study focusing on audio and text data [43], the authors use a
multimodal deep learning model based on CNN and BERT
that considers both audio and text data to classify crime-
related events. This model is advantageous when audio data,
such as 911 calls, is available and can provide a complete
picture of the crime event.
These research articles including multiple other stud-
ies [38], [48] highlight that deep learning algorithms,
including CNN and RNN, have successfully applied to
various data types for crime prediction and classification.
These studies demonstrate the versatility of deep learning
algorithms in this field and provide valuable insights into the
factors contributing to criminal activity. By leveraging the
strengths of these models, law enforcement agencies can gain
a more comprehensive understanding of criminal activity and
take proactive measures to prevent crime from occurring.
VI. DISCUSSION AND FUTURE WORK
The adoptions of machine and deep learning algorithms
to predict or detect crime has shown great promise in
addressing this complex problem. By utilizing vast datasets
and advanced algorithms, these technologies can potentially
improve the accuracy and effectiveness of crime prediction
models. However, despite the advances in this field, there are
still significant gaps in the current understanding of how these
technologies can be effectively applied to the problem of
crime prediction. In this section, we will discuss the potential
60164
VOLUME 11, 2023

--- Page 13 ---

V. Mandalapu et al.: Crime Prediction Using ML and DL: A Systematic Review and Future Directions
TABLE 6. Future Research Directions.
benefits of machine learning and deep learning algorithms for
crime prediction and the future research.
One of the primary advantages of machine learning and
deep learning algorithms for crime prediction is the ability
to analyze large datasets and identify patterns in criminal
activity or behavior. The ability of these algorithms to process
vast amounts of data, including social media and other online
sources [62], [63], can provide valuable insights into criminal
activities that are yet to be committed. Furthermore, deep
learning algorithms like CNN and RNNs have been used
to analyze video footage from security cameras [64]. This
capability provides a more accurate and efficient means
of detecting criminal activities. Another major benefit of
machine learning and deep learning for crime prediction
is the ability to develop real-time prediction models [65].
These models can be used to analyze crime data in real-time
and to predict future crime incidents. This supports law
enforcement agencies to act quickly if a criminal activity
is being committed. Additionally, integrating decentralized
machine learning algorithms with wearable technology, such
as body cameras and smartwatches [1], [66], provides new
opportunities to collect and analyze data related to criminal
activities.
Even though machine learning and deep learning algo-
rithms support effective crime prediction, there are still
some significant challenges that needs to be addressed.
One of the major challenges in this area is the need for
interpretable models [54], [67] that can provide clear expla-
nations of their predictions. This is particularly important
in the context of crime prediction, as incorrect predictions
might lead to serious consequences for individuals and
communities [68]. Apart from the existing model-based
explanation methods, it is also important to incorporate causal
based explanations [69], [70] that focus on cause and effect
relationship between crime patterns and relevant feature
variables. Another challenge that needs to be addressed is
the need for more accurate and reliable data. In order to
effectively apply machine learning and deep learning for
crime prediction, it is important to have access to high-quality
and up-to-date crime data [71]. As this study showed that
many earlier researchers took advantage of data related to
demographics, whether outside of crime-relevant datasets,
there is a need to develop algorithms that can accurately
handle data from multiple sources and integrate it into a single
predictive model.
Another significant area of focus should be to research
more on the ethical implications [72], [73] of using machine
learning and deep learning for crime prediction. As these
technologies are used to predict individuals and communities,
it is important to ensure that they do not perpetuate existing
biases or lead to discrimination [74], [75]. Furthermore, there
is a need for more research on the privacy implications
of using these technologies for crime prediction [76], [77],
[78], this included but not limited to the potential risks
of data breaches and the misuse of personal information.
Another significant gap in the existing research is the need
for more research studies on the effectiveness of machine
learning and deep learning for crime prediction in the real
world [79]. While these technologies have shown great
promise in this area, there is a need for more rigorous
evaluations of their accuracy and effectiveness [80] in real-
world scenarios. Additionally, there is a need for more
research on the scalability of these technologies and the
challenges associated with their implementation in large-
scale systems.
Overall, machine learning and deep learning method-
ologies have the potential to transform the field of crime
prediction by providing more accurate and effective methods
for predicting criminal activities. However, in order to fully
realize the potential of these technologies, it is important to
address the existing research gaps and challenges, including
the need for interpretable models, accurate and reliable data,
ethical considerations, and more rigorous evaluations of
their accuracy and effectiveness. By addressing these gaps,
we can advance our understanding of the role of machine
learning and deep learning algorithms in crime prediction and
contribute to the development of more effective and efficient
policing strategies.
As a future research goal and agenda, we have illustrated
a range of prospective research directions in the area of
VOLUME 11, 2023
60165

--- Page 14 ---

V. Mandalapu et al.: Crime Prediction Using ML and DL: A Systematic Review and Future Directions
TABLE 7. Crime detection papers with data science algorithms.
60166
VOLUME 11, 2023

--- Page 15 ---

V. Mandalapu et al.: Crime Prediction Using ML and DL: A Systematic Review and Future Directions
TABLE 7. (Continued.) Crime detection papers with data science algorithms.
neighborhood crime based on the importance and also
current lack of focus in the areas. From Table 6, future
researchers may want to address concerns like - ‘‘Are
there any reinforcement learning techniques available to
detect the neighborhood crime?’’, and What are the visual
features to be considered to detect the neighborhood crime?
The relevant datasets are available for such identified
future research questions; such data may be utilized to
accomplish the goal of early recognition of neighborhood
crime.
The presented literature base and futuristic research goals
offer a number of elements to direct future studies and
thus theoretically support the effort to identify neighborhood
crimes. Our systematic review offers a thorough grasp of
the characteristics and methods used by earlier research to
recognize and detect crimes. In addition, we have outlined
8 more research questions that fall into the categories of
technique-oriented questions and feature-oriented questions
in Table 6. Practically speaking, this systematic review
serves as a guide for various researchers, practitioners, first
responders, and crime analysts, to take into account the
studied features and techniques to effectively understand and
detect the crimes that, in part, foster the effort for early crime
detection.
VII. CONCLUSION
The complexity of crimes has increased along with tech-
nological development, creating difficult problems for law
enforcement. Researchers’ interest in utilizing machine
learning and deep learning to predict crime has increased
recently, with an emphasis on finding patterns and trends in
crime occurrences. In order to analyze the various machine
learning and deep learning algorithms used in predicting
crime, this paper looks at more than 150 articles. We have
significantly studied the selected 51 articles to extract the
essence of utilized various ML and DL techniques along
with the publicly available datasets. The use of machine
learning and deep learning algorithms to anticipate or identify
criminal activity has shown significant promise in resolving
the crime detection problem. These advances may help to
increase the precision and efficacy of crime prediction models
by leveraging large datasets and sophisticated algorithms.
Although there is a lack of literary wisdom on how these
technologies can be used to solve the problem of crime
prediction, despite the advancements in this sector. Thus
our findings help to understand the implications of various
ML and DL techniques. Also, our mentioned datasets and
future directions will help the existing research community
to pursue their research in the area of crime prediction.
VOLUME 11, 2023
60167

--- Page 16 ---

V. Mandalapu et al.: Crime Prediction Using ML and DL: A Systematic Review and Future Directions
APPENDIX
ADDITIONAL CRIME DETECTION PAPERS USING
MACHINE LEARNING AND DEEP LEARNING
See Table 7.
ACKNOWLEDGMENT
(Varun Mandalapu, Lavanya Elluri, and Piyush Vyas con-
tributed equally to this work.)
REFERENCES
[1] N. Shah, N. Bhagat, and M. Shah, ‘‘Crime forecasting: A machine
learning and computer vision approach to crime prediction and pre-
vention,’’ Vis. Comput. Ind., Biomed., Art, vol. 4, no. 1, pp. 1–14,
Apr. 2021.
[2] S. A. Chun, V. A. Paturu, S. Yuan, R. Pathak, V. Atluri, and N. R. Adam,
‘‘Crime prediction model using deep neural networks,’’ in Proc. 20th Annu.
Int. Conf. Digit. Government Res., Jun. 2019, pp. 512–514.
[3] S. S. Kshatri, D. Singh, B. Narain, S. Bhatia, M. T. Quasim, and
G. R. Sinha, ‘‘An empirical analysis of machine learning algorithms for
crime prediction using stacked generalization: An ensemble approach,’’
IEEE Access, vol. 9, pp. 67488–67500, 2021.
[4] C. Janiesch, P. Zschech, and K. Heinrich, ‘‘Machine learning and deep
learning,’’ Electron. Mark., vol. 31, no. 3, pp. 685–695, Apr. 2021.
[5] W. Safat, S. Asghar, and S. A. Gillani, ‘‘Empirical analysis for crime
prediction and forecasting using machine learning and deep learning
techniques,’’ IEEE Access, vol. 9, pp. 70080–70094, 2021.
[6] S. Kim, P. Joshi, P. S. Kalsi, and P. Taheri, ‘‘Crime analysis through
machine learning,’’ in Proc. IEEE 9th Annu. Inf. Technol., Electron. Mobile
Commun. Conf. (IEMCON), Nov. 2018, pp. 415–420.
[7] D. M. Raza and D. B. Victor, ‘‘Data mining and region prediction based
on crime using random forest,’’ in Proc. Int. Conf. Artif. Intell. Smart Syst.
(ICAIS), Mar. 2021, pp. 980–987.
[8] L. Elluri, V. Mandalapu, and N. Roy, ‘‘Developing machine learning based
predictive models for smart policing,’’ in Proc. IEEE Int. Conf. Smart
Comput. (SMARTCOMP), Jun. 2019, pp. 198–204.
[9] A. Meijer and M. Wessels, ‘‘Predictive policing: Review of benefits
and drawbacks,’’ Int. J. Public Admin., vol. 42, no. 12, pp. 1031–1039,
Sep. 2019.
[10] S. Hossain, A. Abtahee, I. Kashem, M. M. Hoque, and I. H. Sarker,
‘‘Crime prediction using spatio-temporal data,’’ in Computing Science,
Communication and Security. Gujarat, India: Springer, 2020, pp. 277–289.
[11] M. Saraiva, I. Matijosaitiene, S. Mishra, and A. Amante, ‘‘Crime
prediction and monitoring in Porto, Portugal, using machine learning,
spatial and text analytics,’’ ISPRS Int. J. Geo-Inf., vol. 11, no. 7, p. 400,
Jul. 2022.
[12] O. Kounadi, A. Ristea, A. Araujo, and M. Leitner, ‘‘A systematic review
on spatial crime forecasting,’’ Crime Sci., vol. 9, pp. 1–22, Dec. 2020.
[13] L. J. Morrisey, ‘‘Bibliometric and bibliographic analysis in an era of
electronic scholarly communication,’’ in Scholarly Communication in
Science and Engineering Research in Higher Education. Evanston, IL,
USA: Routledge, 2013, pp. 149–160.
[14] M. Hofmann and A. Chisholm, Text Mining and Visualization: Case
Studies Using Open-Source Tools, vol. 40. Boca Raton, FL, USA: CRC
Press, 2016.
[15] P. Tamilarasi and R. U. Rani, ‘‘Diagnosis of crime rate against women
using K-fold cross validation through machine learning,’’ in Proc.
4th Int. Conf. Comput. Methodologies Commun. (ICCMC), Mar. 2020,
pp. 1034–1038.
[16] A. Kumar, A. Verma, G. Shinde, Y. Sukhdeve, and N. Lal, ‘‘Crime
prediction using K-nearest neighboring algorithm,’’ in Proc. Int. Conf.
Emerg. Trends Inf. Technol. Eng., Feb. 2020, pp. 1–4.
[17] S. Agarwal, L. Yadav, and M. K. Thakur, ‘‘Crime prediction based on
statistical models,’’ in Proc. 11th Int. Conf. Contemp. Comput. (IC),
Aug. 2018, pp. 1–3.
[18] S. R. Bandekar and C. Vijayalakshmi, ‘‘Design and analysis of machine
learning algorithms for the reduction of crime rates in India,’’ Proc.
Comput. Sci., vol. 172, pp. 122–127, Jan. 2020.
[19] A. Gahalot, S. Dhiman, and L. Chouhan, ‘‘Crime prediction and
analysis,’’ in Proc. 2nd Int. Conf. Data, Eng. Appl. (IDEA), Feb. 2020,
pp. 1–6.
[20] B. Sivanagaleela and S. Rajesh, ‘‘Crime analysis and prediction using
fuzzy C-means algorithm,’’ in Proc. 3rd Int. Conf. Trends Electron.
Informat. (ICOEI), Apr. 2019, pp. 595–599.
[21] A. M. Shermila, A. B. Bellarmine, and N. Santiago, ‘‘Crime data analysis
and prediction of perpetrator identity using machine learning approach,’’
in Proc. 2nd Int. Conf. Trends Electron. Informat. (ICOEI), May 2018,
pp. 107–114.
[22] C. Catlett, E. Cesario, D. Talia, and A. Vinci, ‘‘A data-driven
approach for spatio-temporal crime predictions in smart cities,’’ in
Proc. IEEE Int. Conf. Smart Comput. (SMARTCOMP), Jun. 2018,
pp. 17–24.
[23] C. Catlett, E. Cesario, D. Talia, and A. Vinci, ‘‘Spatio-temporal crime
predictions in smart cities: A data-driven approach and experiments,’’
Pervas. Mobile Comput., vol. 53, pp. 62–74, Feb. 2019.
[24] F. Yi, Z. Yu, F. Zhuang, X. Zhang, and H. Xiong, ‘‘An inte-
grated model for crime prediction using temporal and spatial fac-
tors,’’ in Proc. IEEE Int. Conf. Data Mining (ICDM), Nov. 2018,
pp. 1386–1391.
[25] S. K. Dash, I. Safro, and R. S. Srinivasamurthy, ‘‘Spatio-temporal
prediction of crimes using network analytic approach,’’ in Proc. IEEE Int.
Conf. Big Data (Big Data), Dec. 2018, pp. 1912–1917.
[26] X. Han, X. Hu, H. Wu, B. Shen, and J. Wu, ‘‘Risk prediction of theft crimes
in urban communities: An integrated model of LSTM and ST-GCN,’’ IEEE
Access, vol. 8, pp. 217222–217230, 2020.
[27] Z. Li, C. Huang, L. Xia, Y. Xu, and J. Pei, ‘‘Spatial-temporal hypergraph
self-supervised learning for crime prediction,’’ in Proc. IEEE 38th Int.
Conf. Data Eng. (ICDE), May 2022, pp. 2984–2996.
[28] N. Tasnim, I. T. Imam, and M. M. A. Hashem, ‘‘A novel multi-module
approach to predict crime based on multivariate spatio-temporal data
using attention and sequential fusion model,’’ IEEE Access, vol. 10,
pp. 48009–48030, 2022.
[29] B. Zhou, L. Chen, S. Zhao, S. Li, Z. Zheng, and G. Pan, ‘‘Unsu-
pervised domain adaptation for crime risk prediction across cities,’’
IEEE Trans. Computat. Social Syst., early access, Sep. 29, 2022, doi:
10.1109/TCSS.2022.3207987.
[30] U. M. Butt, S. Letchmunan, F. H. Hassan, M. Ali, A. Baqir, T. W. Koh,
and H. H. R. Sherazi, ‘‘Spatio-temporal crime predictions by leveraging
artificial intelligence for citizens security in smart cities,’’ IEEE Access,
vol. 9, pp. 47516–47529, 2021.
[31] S. Yao, M. Wei, L. Yan, C. Wang, X. Dong, F. Liu, and Y. Xiong,
‘‘Prediction of crime hotspots based on spatial factors of random forest,’’
in Proc. 15th Int. Conf. Comput. Sci. Educ. (ICCSE), Aug. 2020,
pp. 811–815.
[32] M. Sathiyanarayanan, A. K. Junejo, and O. Fadahunsi, ‘‘Visual analysis
of predictive policing to improve crime investigation,’’ in Proc. Int. Conf.
Contemp. Comput. Informat. (ICI), Dec. 2019, pp. 197–203.
[33] A. Araujo, N. Cacho, L. Bezerra, C. Vieira, and J. Borges, ‘‘Towards a
crime hotspot detection framework for patrol planning,’’ in Proc. IEEE
20th Int. Conf. High Perform. Comput. Commun., IEEE 16th Int. Conf.
Smart City, IEEE 4th Int. Conf. Data Sci. Syst. (HPCC/SmartCity/DSS),
Jun. 2018, pp. 1256–1263.
[34] A. A. Almuhanna, M. M. Alrehili, S. H. Alsubhi, and L. Syed, ‘‘Prediction
of crime in neighbourhoods of New York City using spatial data analysis,’’
in Proc. 1st Int. Conf. Artif. Intell. Data Analytics (CAIDA), Apr. 2021,
pp. 23–30.
[35] A. Baqir, S. U. Rehman, S. Malik, F. U. Mustafa, and U. Ahmad,
‘‘Evaluating the performance of hierarchical clustering algorithms to detect
spatio-temporal crime hot-spots,’’ in Proc. 3rd Int. Conf. Comput., Math.
Eng. Technol. (iCoMET), Jan. 2020, pp. 1–5.
[36] A. Algefes, N. Aldossari, F. Masmoudi, and E. Kariri, ‘‘A text-mining
approach for crime tweets in Saudi Arabia: From analysis to prediction,’’
in Proc. 7th Int. Conf. Data Sci. Mach. Learn. Appl. (CDMA), Mar. 2022,
pp. 109–114.
[37] S. P. C. W. Sandagiri, B. T. G. S. Kumara, and B. Kuhaneswaran,
‘‘Detecting crime related Twitter posts using artificial neural networks
based approach,’’ in Proc. 20th Int. Conf. Adv. ICT Emerg. Regions (ICTer),
Nov. 2020, pp. 5–10.
[38] M. A. Permana, M. I. Thohir, T. Mantoro, and M. A. Ayu, ‘‘Crime rate
detection based on text mining on social media using logistic regression
algorithm,’’ in Proc. IEEE 7th Int. Conf. Comput., Eng. Design (ICCED),
Aug. 2021, pp. 1–6.
60168
VOLUME 11, 2023

--- Page 17 ---

V. Mandalapu et al.: Crime Prediction Using ML and DL: A Systematic Review and Future Directions
[39] X. Zhou, X. Wang, G. Brown, C. Wang, and P. Chin, ‘‘Mixed spatio-
temporal neural networks on real-time prediction of crimes,’’ in Proc. 20th
IEEE Int. Conf. Mach. Learn. Appl. (ICMLA), Dec. 2021, pp. 1749–1754.
[40] R. Shenoy, D. Yadav, H. Lakhotiya, and J. Sisodia, ‘‘An intelligent
framework for crime prediction using behavioural tracking and motion
analysis,’’ in Proc. Int. Conf. Emerg. Smart Comput. Informat. (ESCI),
Mar. 2022, pp. 1–6.
[41] N. Aldossari, A. Algefes, F. Masmoudi, and E. Kariri, ‘‘Data science
approach for crime analysis and prediction: Saudi Arabia use-case,’’ in
Proc. 5th Int. Conf. Women Data Sci. Prince Sultan Univ. (WiDS PSU),
Mar. 2022, pp. 20–25.
[42] Y. Ma, K. Nakamura, E. Lee, and S. S. Bhattacharyya, ‘‘EADTC:
An approach to interpretable and accurate crime prediction,’’ in Proc. IEEE
Int. Conf. Syst., Man, Cybern. (SMC), Oct. 2022, pp. 170–177.
[43] M. Boukabous and M. Azizi, ‘‘Multimodal sentiment analysis using audio
and text for crime detection,’’ in Proc. 2nd Int. Conf. Innov. Res. Appl. Sci.,
Eng. Technol. (IRASET), Mar. 2022, pp. 1–5.
[44] L. G. A. Alves, H. V. Ribeiro, and F. A. Rodrigues, ‘‘Crime prediction
through urban metrics and statistical learning,’’ Phys. A, Stat. Mech. Appl.,
vol. 505, pp. 435–443, Sep. 2018.
[45] J. He and H. Zheng, ‘‘Prediction of crime rate in urban neighborhoods
based on machine learning,’’ Eng. Appl. Artif. Intell., vol. 106, Nov. 2021,
Art. no. 104460.
[46] H. K. R. ToppiReddy, B. Saini, and G. Mahajan, ‘‘Crime prediction &
monitoring framework based on spatial analysis,’’ Proc. Comput. Sci.,
vol. 132, pp. 696–705, Jan. 2018.
[47] A. Wolf, T. R. Fanshawe, A. Sariaslan, R. Cornish, H. Larsson, and
S. Fazel, ‘‘Prediction of violent crime on discharge from secure psychiatric
hospitals: A clinical prediction rule (FoVOx),’’ Eur. Psychiatry, vol. 47,
pp. 88–93, Jan. 2018.
[48] K. B. Sahay, B. Balachander, B. Jagadeesh, G. A. Kumar, R. Kumar, and
L. R. Parvathy, ‘‘A real time crime scene intelligent video surveillance
systems in violence detection framework using deep learning techniques,’’
Comput. Electr. Eng., vol. 103, Oct. 2022, Art. no. 108319.
[49] P. E. P. Utomo, ‘‘Prediction the crime motorcycles of theft using ARIMAX-
TFM with single input,’’ in Proc. 3rd Int. Conf. Informat. Comput. (ICIC),
Oct. 2018, pp. 1–7.
[50] V. Ingilevich and S. Ivanov, ‘‘Crime rate prediction in the urban envi-
ronment using social factors,’’ Proc. Comput. Sci., vol. 136, pp. 472–478,
Jan. 2018.
[51] A. R. C. da Silva, I. C. D. P. Junior, T. L. C. da Silva, J. A. F. de Macedo,
and W. C. P. Silva, ‘‘Prediction of crime location in a Brazilian city using
regression techniques,’’ in Proc. IEEE 32nd Int. Conf. Tools Artif. Intell.
(ICTAI), Nov. 2020, pp. 331–336.
[52] P. Das, A. K. Das, J. Nayak, D. Pelusi, and W. Ding, ‘‘Incremental classifier
in crime prediction using bi-objective particle swarm optimization,’’ Inf.
Sci., vol. 562, pp. 279–303, Jul. 2021.
[53] Z. Yan, H. Chen, X. Dong, K. Zhou, and Z. Xu, ‘‘Research on prediction
of multi-class theft crimes by an optimized decomposition and fusion
method based on XGBoost,’’ Exp. Syst. Appl., vol. 207, Nov. 2022,
Art. no. 117943.
[54] X. Zhang, L. Liu, M. Lan, G. Song, L. Xiao, and J. Chen, ‘‘Interpretable
machine learning models for crime prediction,’’ Comput., Environ. Urban
Syst., vol. 94, Jun. 2022, Art. no. 101789.
[55] M. L. Trinhammer, A. C. H. Merrild, J. F. Lotz, and G. Makransky,
‘‘Predicting crime during or after psychiatric care: Evaluating machine
learning for risk assessment using the Danish patient registries,’’ J.
Psychiatric Res., vol. 152, pp. 194–200, Aug. 2022.
[56] A. K. Das and P. Das, ‘‘Graph based ensemble classification for
crime report prediction,’’ Appl. Soft Comput., vol. 125, Aug. 2022,
Art. no. 109215.
[57] W. Liang, Y. Wang, H. Tao, and J. Cao, ‘‘Towards hour-level crime
prediction: A neural attentive framework with spatial–temporal-categorical
fusion,’’ Neurocomputing, vol. 486, pp. 286–297, May 2022.
[58] U. V. Navalgund and K. Priyadharshini, ‘‘Crime intention detection system
using deep learning,’’ in Proc. Int. Conf. Circuits Syst. Digit. Enterprise
Technol. (ICCSDET), Dec. 2018, pp. 1–6.
[59] M. Nakib, R. T. Khan, Md. S. Hasan, and J. Uddin, ‘‘Crime scene
prediction by detecting threatening objects using convolutional neural
network,’’ in Proc. Int. Conf. Comput., Commun., Chem., Mater. Electron.
Eng., Feb. 2018, pp. 1–4.
[60] S. Chackravarthy, S. Schmitt, and L. Yang, ‘‘Intelligent crime anomaly
detection in smart cities using deep learning,’’ in Proc. IEEE 4th Int. Conf.
Collaboration Internet Comput. (CIC), Oct. 2018, pp. 399–404.
[61] A. Karpathy, G. Toderici, S. Shetty, T. Leung, R. Sukthankar, and
L. Fei-Fei, ‘‘Large-scale video classification with convolutional neural
networks,’’ in Proc. IEEE Conf. Comput. Vis. Pattern Recognit., Jun. 2014,
pp. 1725–1732.
[62] D. Yang, T. Heaney, A. Tonon, L. Wang, and P. Cudré-Mauroux,
‘‘CrimeTelescope: Crime hotspot prediction based on urban and social
media data fusion,’’ World Wide Web, vol. 21, no. 5, pp. 1323–1347,
Sep. 2018.
[63] A. Ristea, M. Al Boni, B. Resch, M. S. Gerber, and M. Leitner, ‘‘Spatial
crime distribution and prediction for sporting events using social media,’’
Int. J. Geographical Inf. Sci., vol. 34, no. 9, pp. 1708–1739, Sep. 2020.
[64] M. Muthamizharasan and R. Ponnusamy, ‘‘Forecasting crime event
rate with a CNN-LSTM model,’’ in Innovative Data Communica-
tion Technologies and Application. Berlin, Germany: Springer, 2022,
pp. 461–470.
[65] B. Wang, P. Yin, A. L. Bertozzi, P. J. Brantingham, S. J. Osher, and J. Xin,
‘‘Deep learning for real-time crime forecasting and its ternarization,’’ Chin.
Ann. Math., Ser. B, vol. 40, no. 6, pp. 949–966, Nov. 2019.
[66] P. William, A. Shrivastava, N. S. Karpagam, T. Mohanaprakash,
K. Tongkachok, and K. Kumar, ‘‘Crime analysis using computer vision
approach with machine learning,’’ in Mobile Radio Communications and
5G Networks. Berlin, Germany: Springer, 2023, pp. 297–315.
[67] C. Wang, B. Han, B. Patel, and C. Rudin, ‘‘In pursuit of interpretable,
fair and accurate machine learning for criminal recidivism prediction,’’
J. Quant. Criminol., vol. 39, pp. 519–581, Mar. 2022.
[68] J. Dressel and H. Farid, ‘‘The dangers of risk prediction in the criminal
justice system,’’ MIT Case Stud. Social Ethical Responsibilities Comput.,
Winter 2021, doi: 10.21428/2c646de5.f5896f9f.
[69] R. Moraffah, M. Karami, R. Guo, A. Raglin, and H. Liu, ‘‘Causal
interpretability for machine learning—Problems, methods and evalu-
ation,’’ ACM SIGKDD Explor. Newslett., vol. 22, no. 1, pp. 18–33,
May 2020.
[70] E. Carter, T. Ward, and A. Strauss-Hughes, ‘‘The classification of crime
and its related problems: A pluralistic approach,’’ Aggression Violent
Behav., vol. 59, Jun. 2020, Art. no. 101440.
[71] R. Richardson, J. M. Schultz, and K. Crawford, ‘‘Dirty data, bad
predictions: How civil rights violations impact police data, predictive
policing systems, and justice,’’ NYUL Rev. Online, vol. 94, p. 15,
Jan. 2019.
[72] P. M. Asaro, ‘‘AI ethics in predictive policing: From models of threat to
an ethics of care,’’ IEEE Technol. Soc. Mag., vol. 38, no. 2, pp. 40–53,
Jun. 2019.
[73] O. J. Gstrein, A. Bunnik, and A. Zwitter, ‘‘Ethical, legal and social
challenges of predictive policing,’’ Catolica Law Rev., Direito Penal, vol. 3,
no. 3, pp. 77–98, 2019.
[74] K. Alikhademi, E. Drobina, D. Prioleau, B. Richardson, D. Purves, and
J. E. Gilbert, ‘‘A review of predictive policing from the perspective of
fairness,’’ Artif. Intell. Law, vol. 30, no. 1, pp. 1–17, Mar. 2022.
[75] M. Tonry, ‘‘Predictions of dangerousness in sentencing: Déjà vu all over
again,’’ Crime Justice, vol. 48, pp. 439–482, May 2019.
[76] R. Muhlhoff, ‘‘Predictive privacy: Towards an applied ethics of data
analytics,’’ Ethics Inf. Technol., vol. 23, no. 4, pp. 675–690, Dec. 2021.
[77] T.-W. Hung and C.-P. Yen, ‘‘On the person-based predictive policing of
AI,’’ Ethics Inf. Technol., vol. 23, no. 3, pp. 165–176, Sep. 2021.
[78] D. Leslie, ‘‘Understanding bias in facial recognition technologies,’’ 2020,
arXiv:2010.07023.
[79] I. H. Sarker, ‘‘Machine learning: Algorithms, real-world applications and
research directions,’’ Social Netw. Comput. Sci., vol. 2, no. 3, p. 160,
May 2021.
[80] S. Goel, R. Shroff, J. Skeem, and C. Slobogin, ‘‘The accuracy, equity, and
jurisprudence of criminal risk assessment,’’ in Research Handbook on Big
Data Law. Cheltenham, U.K.: Edward Elgar Publishing, 2021, pp. 9–28.
[81] R. Yadav and S. K. Sheoran, ‘‘Crime prediction using auto regression
techniques for time series data,’’ in Proc. 3rd Int. Conf. Workshops Recent
Adv. Innov. Eng. (ICRAIE), Nov. 2018, pp. 1–5.
[82] H. Wang and S. Ma, ‘‘Preventing crimes against public health with artificial
intelligence and machine learning capabilities,’’ Socio-Economic Planning
Sci., vol. 80, Mar. 2022, Art. no. 101043.
[83] J. Abraham, R. Ng, M. Morelato, M. Tahtouh, and C. Roux, ‘‘Automati-
cally classifying crime scene images using machine learning methodolo-
gies,’’ Forensic Sci. Int., Digit. Invest., vol. 39, Dec. 2021, Art. no. 301273.
VOLUME 11, 2023
60169

--- Page 18 ---

V. Mandalapu et al.: Crime Prediction Using ML and DL: A Systematic Review and Future Directions
VARUN MANDALAPU received the master’s
degree in management information systems from
the University of Illinois Springfield, the master’s
degree in sensor systems technology from the
Vellore Institute of Technology, Vellore, India,
and the Ph.D. degree in artificial intelligence
and knowledge management from the Department
of Information Systems, University of Maryland
Baltimore County. He is a Research Assistant
with the Sensor Accelerated Intelligent Learning
(SAIL) Laboratory at UMBC under Dr. Jiaqi Gong and co-advised by
Dr. Zhiyuan Chen and Dr. Karen Chen. He is also an affiliate member of
the IEEE EMBS Technical Committee on Wearable Biomedical Sensors and
Systems. His research publications appeared in reputed AI venues, such as
AAAI Workshops, Artificial Intelligence in Education, Educational Data
Mining, Smart Health, IEEE Body Sensor Networks, and IEEE Biomedical
Health Informatics.
LAVANYA ELLURI (Member, IEEE) received
the Ph.D. degree in information systems from
the University of Maryland Baltimore County
and the Master of Science degree in management
information systems from the University of Hous-
ton Clear Lake. She has worked for over a decade
in the IT industry at reputed companies Infosys
and REI Systems. She has led several projects at
REI systems and has extensive work experience
with various databases and data warehousing
technologies. Also, she has experience in working with a wide range of data
science and data analytics projects. She is currently an Assistant Professor in
computer information systems with Texas A&M University—Central Texas.
Her research and teaching interests include data analytics, data science,
semantic web, database systems, data privacy and security, text mining, and
healthcare IT systems. Her research publications appeared in reputed venues,
such as IEEE Big Data, IEEE Cloud, IEEE ACCESS, and Frontiers in Bigdata.
PIYUSH VYAS received the Bachelor of Engineer-
ing and Master of Engineering degrees in informa-
tion technology from State Technical University
Bhopal, India, in 2009 and 2012, respectively,
and the M.S. and Ph.D. degrees in information
systems from Dakota State University, Madison,
SD, USA, in 2020 and 2022, respectively. He is
currently an Assistant Professor in computer infor-
mation systems with Texas A&M University—
Central Texas. He has published his articles
in IEEE TRANSACTIONS ON TECHNOLOGY AND SOCIETY, Special Issues of
Information Systems, International Journal of Information Security and
Privacy (IJISP-IGI Global)-ABDC, AIS-AMCIS, AIS-MWAIS, DSI, and
IEEE conferences. His teaching interests include machine learning, data
communications, computer networks, business analytics, system analysis
and design, and database management systems. His current research interests
include text mining, association rule mining, traditional and online machine
learning, transfer learning, deep learning, the data mining in the domain
of e-commerce, social media, micro-blogging, healthcare, medical imaging,
dark web, and explainable/conversational AI. He has received the Best
Research Paper Award for AMCIS 2021.
NIRMALYA ROY (Member, IEEE) received the
bachelor’s degree in computer science and engi-
neering from Jadavpur University, India, in 2001,
and the M.S. and Ph.D. degrees in computer
science and engineering from The University of
Texas at Arlington, in 2004 and 2008, respectively.
He is currently a Professor with the Department
of Information Systems, University of Maryland
Baltimore County. He directs the Mobile, Perva-
sive and Sensor Computing (MPSC) Laboratory.
He was a Clinical Assistant Professor with the School of Electrical
Engineering and Computer Science, Washington State University, from
January 2012 to June 2013. Prior to that, he was a Research Scientist with
the Institute for Infocomm Research (I2R), Singapore, from 2010 to 2011.
He was a Postdoctoral Fellow with the Electrical and Computer Engineering
Department, The University of Texas at Austin, from 2008 to 2009.
60170
VOLUME 11, 2023
