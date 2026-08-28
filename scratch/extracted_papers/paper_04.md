--- Page 1 ---

Received 14 January 2026, accepted 23 January 2026, date of publication 28 January 2026, date of current version 3 February 2026.
Digital Object Identifier 10.1109/ACCESS.2026.3658944
AI and Machine Learning-Enabled Cognitive
Digital Twin for Crime Hotspot
Detection and Analysis
T. C. SHIRAPTINI, KAVITHA DHANUSHKODI
, S. SAKTHIPRIYA,
S. AKSHAYA, AND SHERLY ALPHONSE
School of Computer Science and Engineering, Vellore Institute of Technology, Chennai, India
Corresponding author: Kavitha Dhanushkodi (kavitha.d@vit.ac.in)
This work was supported by Vellore Institute of Technology, Chennai, India.
ABSTRACT A cognitive digital twin using AI and machine learning is proposed in this study. System
of crime hot spot identification and investigations in cities. The suggested system forms up a simulated
copy of city areas through blending historical crime observations, the environment and real. Introduction
of time sensors to model, simulate and predict criminal activity. In this cognitive brother, machine learning
algorithms such as time-series forecasting, classification and clustering techniques are used to determine
the spatial and temporal trends of crime, which will make the high-risk regions predictable. The AI motor
cognitive layer improves reasoning and flexibility in the digital space and enables the twin to constantly learn
with new information and simulate different policing policies, including optimized patrol pathfinding and
allocation of resources. The prediction of data by transforming both the real-time and non-real-time data
into predictive knowledge. System facilitates decision-making proactively and effective law enforcement
planning. The results demonstrate that the AI-ML-powered Cognitive Digital Twin (CDT) has a strong
enhancement in the accuracy of crime hotspots prediction and situational consciousness, building scalable,
adaptive, and data-driven system of smart, preventive policing and urban safety enhancement.
INDEX TERMS Cognitive digital twin (CDT), artificial intelligence (AI), machine learning (ML), real-time
data, crime hotspot detection, predictive policing, urban safety.
I. INTRODUCTION
Crime in cities has become one of the most burning issues
of contemporary societies that do not only impact safety
and security of people, but also the entire socio-economic
progress of cities. Old methods of crime prevention are usu-
ally based on historical analysis and human intuition which
is not very scalable and responsive. As the volume of digital
information is growing exponentially, and artificial intelli-
gence continues to evolve, the possibility of creating smarter
systems to help foresee and prevent crimes before they hap-
pen continues to rise. This has given rise to the so-called
Cognitive Digital Twins (CDTs) of real-world environments
that are supplemented with cognitive functions to deliver
The associate editor coordinating the review of this manuscript and
approving it for publication was Majdi Mansouri.
a better understanding of the urban dynamics and criminal
behavior.
Instead of a traditional digital twin, a Cognitive Digi-
tal Twin has an added feature of reasoning, learning, and
making decisions, which are driven by AI. It is a smart
virtual representation of a city that is changing based on the
constant stream of data. Combining historical crime infor-
mation, environmental properties, and real-time sensor data,
the CDT can simulate an urban environment and identify-
ing new crime patterns and creating predictive information.
This will allow law enforcement agencies to shift towards
more proactive/data-driven decision-making and stop reac-
tive policing.
A combination of Artificial Intelligence (AI) and Machine
Learning (ML) into the CDT framework increases its capacity
to learn on the data and develop spatial, temporal correlations
16792
 2026 The Authors. This work is licensed under a Creative Commons Attribution 4.0 License.
For more information, see https://creativecommons.org/licenses/by/4.0/
VOLUME 14, 2026

--- Page 2 ---

T. C. Shiraptini et al.: AI and ML-Enabled CDT for Crime Hotspot Detection and Analysis
and increase prediction accuracy as time goes on. Time-series
forecasting, clustering, and classification are machine learn-
ing models that are instrumental in determining crime
hotspots, their development, and predicting possible high-risk
regions. In the meantime, AI reasoning modules enable the
CDT to simulate several policing decisions, including optimal
patrol routes, strategic resource distribution and surveillance
location use, and so forth. The outcome is an ever-changing
system that can enhance the situational awareness and oper-
ational efficiency.
FIGURE 1. Infographic of integrated AI & ML for urban crime
prevention CDT.
In contrast to the old-fashioned statistic or rule-based
systems, the AI-ML-based CDT is dynamic and changes
according to the emerging data and the evolving urban envi-
ronment. Its cognitive structure facilitates the creation of
continuous feedback loops with model predictions being
tested, refined and again integrated into the digital envi-
ronment. This flexibility makes predictions to be true even
in dynamic and sophisticated crime-related environments.
Moreover, the modular structure of the framework allows
extending it to other urban settings, and it can be used to
monitor small neighbourhoods as well as entire metropolitan
areas.
In this study, a full-fledged crime hotspots detection and
analysis tool is proposed in an AI and Machine Learning-
Enabled Cognitive Digital Twin. The system allows predic-
tive insights to be formed by transforming both historical and
real-time data into predictive ones, which allows proactive
intervention, resource management optimization, and better
results in terms of public safety. The offered strategy proves
that a combination of cognitive intelligence and machine
learning can turn the conventional crime analysis into a smart,
adaptive and future-proof system of policing used by present-
day cities.
II. METHODOLOGY
A. BACKGROUND STUDY
The development of the urban populations has increased at
a very high rate, and therefore the criminal activities have
begun to take more complex forms making the old methods
of policing extremely challenging. Traditional systems in
crime analysis rely mostly on previous crime data and manual
interpretation that can prove inadequate to offer socio-
environmental, temporal, and behavioral dynamic variations.
To address these drawbacks, Cognitive Digital Twins (CDTs)
have become significant frameworks that can reflect the
state of urban life relying on artificial intelligence (AI) and
machine learning (ML).
A Cognitive Digital Twin is a simulated representation of
an urban setting that can continual learn and adjust itself
depending on the input information. CDTs are able to recreate
the criminal behavior, forecast the development of hotspots,
and suggest preventive measures through the combination of
historical data, current sensor measurements, and indicators
of environmental factors. As Wang et al. [1] established,
spatio-temporal deep learning models have the ability to
predict accurately the distribution of crime in the city by
correlating these factors like lighting conditions, crowd den-
sity, and urban mobility. On the same note, Park et al. [2]
suggested a Generative Adversarial Network (GAN)-based
model, which produces fake crime data to act as a substitute of
underreported or incomplete datasets, which enhances model
resilience and extrapolation.
FIGURE 2. Steps in AI & ML for CDT.
Xplainable AI (XAI) technologies are also being incorpo-
rated into CDT systems to make police applications more
readable and trusted. Javeed et al. [3] introduced a cognitive
twin-based safety model, which made use of SHapley Addi-
tive exPlanations (SHAP) to render prediction outcomes clear
and comprehensible to decision-makers. A hybrid framework
that involves a combination of deep learning models with
real-time simulation to optimize patrol paths and resource
allocation plans was proposed by Kumar and Hans [4].
All these developments together demonstrate that AI- and
ML-based CDTs can be used as scalable, adaptive, and ethical
to proactively predict and prevent crime as a method of data-
driven law enforcement in smart cities.
B. PRE-PROCESSING
As shown in Fig. 1 and Fig. 2, preprocessing is an essential
basis to building a valid and effective AI and ML-based
Cognitive Digital Twin (CDT) paradigm of crime hotspots
prediction. The quality, consistency and structure of input
data is another dependable factor in the effectiveness of
the CDT. Preprocessing is used to ensure that different
datasets are converted to a clean, standardized, and balanced
form to allow the system to capture spatial-temporal dynam-
ics of crime effectively and create reliable predictions.
The information used in this work is based on the data
of various sources, such as law enforcement databases,
VOLUME 14, 2026
16793

--- Page 3 ---

T. C. Shiraptini et al.: AI and ML-Enabled CDT for Crime Hotspot Detection and Analysis
free government crime platforms, and ecological and demo-
graphic data. Such datasets are not always uniform, large,
and precise and therefore preprocessing is a necessity to
harmonize them into a compatible and coherent form of
analysis.
The preprocessing pipeline is a series of process steps
that are meant to improve the quality of models and data
interpretation.
1) Data Cleaning: Step 1 Data cleaning entails eliminating
records with redundancies, inconsistencies, and imput-
ing missing variables by statistical techniques. The
process removes noise and avoids bias when training
the model, so only established and viable data get
included in the learning process of the CDT [1].
2) Feature Extraction: After the cleaning of the data, the
feature extraction is conducted to determine the most
powerful variables that are related to crimes occur-
rences. The characteristics of the crime, the positioning
(latitude and longitude), time and day of the crime,
population density, environmental factors (e.g. street
lighting, closeness to landmarks) are chosen. These
characteristics are the most important variables that
may be used to predict crime in space and time [2].
3) Normalization and Standardization: In order to make
all the features equal to the learning process, normaliza-
tion and standardization is used. Numerical attributes
are normalized in min-max where the range of values
is [0, 1], and the values are normalized in Z-score where
the values have a zero mean and a unit variance. These
methods stabilize and increase the convergence speed
when training a model, especially the models based on
the neural networks [3].
4) Dimensionality Reduction: When datasets are high-
dimensional, it is possible that the datasets are
redundant and create extra computational burden.
Dimensionality reduction techniques (Principal Com-
ponent Analysis (PCA) and t-distributed Stochastic
Neighbour Embedding (t-SNE)) are employed in order
to preserve the most informative features. This not
only makes computation easier but also improves inter-
pretability of the model since emphasis is put on the
most important variables which influence crime con-
centration [4].
5) Data Augmentation: Crime data is often an imbal-
anced dataset, with some types of crimes (e.g., van-
dalism, burglary) represented more frequently than
others (e.g., cybercrime or assault). In order to over-
come the problem, Generative Adversarial Networks
(GANs) and Synthetic Minority Oversampling Tech-
nique (SMOTE) are used to create synthetic data of
underrepresented classes. This step enhances the gen-
eralization capability of the model and its capability to
capture rare but extremely critical crime event [2].
6) Data Transformation: Lastly, categorical data, crime
type, district classification and incident category,
are converted into numerical encodings by one-hot
encoding and label encoding. This transformation will
allow machine learning models to operate and process
non-numeric variables effectively [5].
Together these preprocessing methods produce a high qual-
ity and structured dataset which makes the CDT more likely
to model actual crime patterns in the world. The outcome
is a strong data base that can be used to support AI and
ML-based predictive modeling, hotspots in real time, and
making strategic decisions during the allocation of resources
to law enforcement. This makes the CDT system a high
precision, consistent, and adaptable system when deployed
in intelligent urban setting.
C. EXPERIMENTAL APPROACH
The present research paper follows the systematic exper-
imental approach to assess the effectiveness and the ver-
satility of the AI and the Machine Learning-Enabled
Cognitive Digital Twin (CDT) in predicting and analysing
crime hot spots in urban settings. The experiments were
formulated to simulate the realistic city conditions that
contained the natural variation and the complexity of inci-
dence of crime which is affected by the spatial, time, and
environments.
The general purpose of such an experimental design is to
(i) determine the predictive qualities of different AI and ML
models under the CDT framework, (ii) determine the extent
to which the CDT can replicate crime patterns in the real
world and (iii) prove the ability of the system to facilitate
data-driven and reactive policing.
This study shows that using an iterative, simulation-based,
and data-driven testing approach, cognitive modelling and
predictive analytics can all be used to improve situational
awareness, optimize police deployment, and mitigate human
bias in crime prevention.
The experimental setup consists of (i) a historical-data-
driven training phase and (ii) a simulation-based prediction
phase, where the CDT forecasts future crime hotspots under
varying temporal and socio-environmental conditions.
1) DEFINITION OF CRIME HOTSPOTS AND PREDICTION
TASK
The operationally defined crime hotspots are applied in this
study. A grid based spatial representation of the urban envi-
ronment. The city is broken into spatial cells of 500 m x size.
500 m to create homogenous spatial analysis.
The incidents of crimes are summed up on a daily basis.
A spatial cell is called a hotspot when the number of crimes
thereon is in the range. The 20% highest of all the cells of a
given day and is statistically significant based on the Getis-
Ord Gi spatial clustering. Test (p < 0.05).
The prediction problem is described as a binary classifica-
tion. Problem, in which one is to forecast whether a given
spatial cell will transform into a hotspot (hotspot vs. non-
hotspot).
There is one day ahead prediction horizon which is
facilitated. Proactive and short-term policing decisions.
16794
VOLUME 14, 2026

--- Page 4 ---

T. C. Shiraptini et al.: AI and ML-Enabled CDT for Crime Hotspot Detection and Analysis
2) EXPERIMENTAL FRAMEWORK AND SETUP
The experimental system is the central part of the CDT
implementation as illustrated in Fig. 3. The model breaks
down into four mutually supporting layers with their individ-
ual functional/analytical responsibilities to recreate a digital
reflection of the urban physical environment:
a: PHYSICAL TWIN LAYER
Refers to the physical infrastructure of the city and is cre-
ated based on geographic data (via Geographic Information
System) about the city such as administrative areas, street
networks, building maps, and population density maps. The
layer forms the geographical basis of the CDT and offers the
geographical background of crime mapping.
b: DATA LAYER
This layer is a layer that combines a wide range of data
sources such as historical crime data, open police data,
weather conditions, demographic data and artificially gener-
ated real-time sensor data. The combination of both static and
dynamic data enables the maintenance of the synchronization
between the physical environment and the cognitive model.
c: COGNITIVE LAYER
Stores the AI and ML models that learn and interpret the
spatial-temporal correlations. This layer works with the data
to reveal patterns that are not obvious, predict the places with
high risks, and model the effects of preventive measures.
d: DECISION LAYER
Produces action insights and visual representations like hot
spot heat maps, predictive alerts, and resource optimization
recommendations. The layer serves as the interface with the
human decision-makers offering the law enforcement officers
the opportunity to visualize predictions and evaluate different
policing strategies virtually.
FIGURE 3. Architecture of AI and ML-Enabled CDT.
To guarantee the presence of realism and flexibility, the
CDT framework is used as a dynamic simulation condi-
tion. Systematic variation in temporal parameters (e.g., time
of day, weekday vs. weekend activity, seasonal variation),
as well as socio-environmental conditions (e.g., festivals,
traffic congestion, weather changes) is varied. The CDT is
constantly updated on the incoming data updating its predic-
tions and decision logic in near real time.
The design will also guarantee that the experimental setting
emulates the predictable and unpredictable variances that will
provide the whole range of challenges that are experienced in
real-life urban policing.
3) SELECTION OF AI MODELS
The intelligence predictive capability of the CDT is mostly
based on the selection of the AI and ML algorithms. Thus,
the proposed research deploys a multi-model assessment plan
comprising traditional and deep learning models. All models
add their own advantages in the representation of certain
features of space, time, or semantic relationships in the crime
data. All models take as input spatial coordinates, temporal
features (time of day and day of week), historical crime
counts, and contextual variables, and output a binary hotspot
prediction for each spatial cell.
a: TRADITIONAL SUPERVISED MACHINE LEARNING
MODELS
In traditional machine learning models, the underlying data
consists of a set of features or measurements that are contin-
uous values. < |human| >a) Traditional Machine Learning
Models In traditional machine learning models, the underly-
ing data is defined as a set of features or measurements that
are continuous values.
1) Support Vector Machine (SVM): SVM is chosen due to
its good performance in binary classification problems,
it is successful in separating high-risk and low-risk
regions. SVM uses radial basis function (RBF) and
polynomial kernels, among other kernel functions,
which identify nonlinear decision boundaries, and so,
SVM is appropriate in the analysis of irregular distri-
butions of crime.
2) Random Forest (RF): The algorithm can be used due to
its abilities in ensemble learning that means that it cre-
ates several decision trees while training and combines
their results to increase the stability of predictions.
It gives information on the significance of features,
assisting in the determination of influential variables,
like time, place, or state of the environment on crime.
b: STATE OF THE ENVIRONMENT ON CRIMEDEEP LEARNING
MODELS FOR SPATIO-TEMPORAL ANALYSIS
1) Convolutional Neural Networks (CNNs): CNNs are
used to examine the spatial dependencies, and they treat
the crime density maps as images. The model attains
intricate spatial structures and hot spots structure by
way of convolutional filters, which can be used to
detect areas that have correlated crime clusters.
VOLUME 14, 2026
16795

--- Page 5 ---

T. C. Shiraptini et al.: AI and ML-Enabled CDT for Crime Hotspot Detection and Analysis
2) Recurrent Neural Networks (RNN) and Long Short-
Term Memory (LSTM): LSTMs can be used in the
modelling of a temporal sequence. They also take into
account changes with time, like the repetitive patterns
during weekends or at night, as well as they learn the
temporal dynamics of crimes by zone.
3) Generative Adversarial Networks (GANs).
GANs are utilized to solve the issue of data imbalance
and improve the dataset by creating synthetic samples of
underrepresented categories of crimes. The discriminator
component is used to improve the synthetic data and generate
realistic patterns according to real observations.
c: HYBRID AND EXPLAINABLE AI MODELS
A Spatio-Temporal Crime Prediction Network (STCN) is
suggested in order to take advantage of spatial and temporal
learning. This hybrid system combines CNN layer to be used
in spatial pattern detection and LSTM layers to be used in
temporal predictions. The model is self-updating as it uses
feedback loops to constantly improve its predictions as it
receives new data which is why it is adaptive to learning as is
typical of cognitive systems.
The combination of the power of several AI paradigms
makes the CDT a self-evolving analytical machine that can
learn through the analysis of its previous predictions and
adapt to the changes in urban behaviours dynamically.
4) HYBRID AND EXPLAINABLE AI MODELS
Trust and accountability Explainability is very important in
AI-assisted law enforcement systems. Explainable AI (XAI)
elements are installed in the architecture of the CDT to facil-
itate clear decision-making.
There are methods like SHapley Additive exPlanations
(SHAP) and Local Interpretable Model-Agnostic Explana-
tions (LIME), which are applied to explain the outputs of a
model and determine which input factors the model was most
likely to rely on in that prediction. As an example, a SHAP
plot may show that the night temperature and the density of
crowds were important predictors of higher street theft in a
particular area.
Besides, CNN, LSTM, and Random Forest ensemble mod-
els are constructed to generate hybrid architectures that have
the advantage of both local interpretability and global predic-
tivity. These explainable hybrid models enable the analysts to
see the location where crime could take place, as well as the
reason why a particular location was identified as a high-risk
area.
According to Fig. 4, the accuracy levels between models
are different, but hybrid and explainable CDT models are
better than traditional ones as they have accuracy rates of
between 95 and 97. This confirms that cognitive learning and
explainability are needed as key factors of effective urban
crime forecasting systems.
5) MODEL TRAINING AND HYPERPARAMETER TUNING
To
have
the
best
model
performance,
experimental
training is done according to strict optimization and
FIGURE 4. Accuracy of AI and ML models in Crime hotspot detection.
validation guidelines. The data is divided into 80% training
data, 10% validation data and 10% testing data. The target
label corresponds to the hotspot classification of each spatial
cell for the next-day prediction window.
The grid search and the random search are used to conduct
hyperparameter tuning to identify the best combination of
learning rates, batch sizes, activating functions and dropout
ratios. The cross validation (k=5) is to make sure that the
models are generalized in unseen data. L1/L2 weight decay,
dropout, and other regularization methods are used to reduce
overfitting in models, particularly deep learning models with
large parameter spaces.
The training sessions are repeated, and the convergence of
the loss and the accuracy of the validation are monitored.
Early stopping methods are used to eliminate superfluous
computation on reaching optimal performance. Incremental
learning is also built within the CDT, where retraining can be
done with new records of crimes or sensor measurings.
This aspect of continuous learning ensures that the system
is kept up to date continuously modifying itself to the chang-
ing trends in urban behaviour and increasing its prediction
accuracy as time goes on.
6) EVALUATION METRICS AND COMPARATIVE ANALYSIS
The crucial element of the validation of the operational effi-
ciency and predictive accuracy of the CDT is the performance
evaluation. The metrics employed are the following:
a: ACCURACY (ACC)
It represents the overall proportion of correctly classified
instances.
b: PRECISION AND RECALL
Measure the false positives and false negatives.
c: F1-SCORE
Balances accuracy and recall evaluating the general detection
accuracy.
d: AUC-ROC CURVE
Measures the classification performance with changing
thresholds, which are useful in the differentiation of hotspots
and non-hotspots.
16796
VOLUME 14, 2026

--- Page 6 ---

T. C. Shiraptini et al.: AI and ML-Enabled CDT for Crime Hotspot Detection and Analysis
e: MORAN I AND GETIS ORD GI
Measures of spatial autocorrelation, which measure how
much the predicted and observed hotspots of crime are
clustered.
Since crime hotspots are relatively rare events, accuracy
is reported only as a supplementary metric, while F1-score,
recall, AUC-ROC, and spatial autocorrelation measures are
considered primary indicators of model performance.
The findings show that the proposed STCN model con-
sistently outperforms standalone algorithms and it is more
stable when exposed to different data distributions. SVM
and RF, on the contrary, are more interpretable but less time
adaptable. Table 1 summarizes these comparative results and
provides the trade-offs among complexity of the models,
computational efficiency and accuracy.
Also, the runtime performance and memory efficiency
were evaluated to provide scalability. CNN and LSTM mod-
els were more computationally intensive but provided better
prediction accuracy, whereas Random Forest was signifi-
cantly more rapid to run with mediocre prediction accuracy,
and could be deployed as an edge-based system.
TABLE 1. Comparative analysis of ai methodologies for crime prediction
and their limitations.
7) REAL-TIME THREAT DETECTION TESTING
One of the main novelties of this work is that the CDT is able
to simulate the prediction of crimes in real-time. The process
occurring in this phase is that the system is constantly fed
with live data streams, which can be the updates of the traffic
density monitors, the event calendar of the population, and
environmental sensors, and it also changes hotspot probabil-
ities on the fly.
These outputs are visualized in the Smart City Command
Dashboard in the form of live heatmaps, showing the histori-
cal trends and future projections at the same time. Predictive
alerts inform the law enforcers of the emerging threats,
and dynamic patrol routing recommendations automatically
update as the likelihood of hot spots changes.
This real time test confirms the ability of the CDT to per-
form autonomous adaptation and decision support and attest
to its practical usefulness in proactive policing and optimal
use of resources.
8) ADDRESSING EXPERIMENTAL CHALLENGES
A number of technical and ethical issues were found during
the experimentation process and addressed in a systematic
manner:
a: DATA IMBALANCE
Handled by GAN-based data augmentation and SMOTE
oversampling in a bid to provide equal representation of
classes.
b: DATA PRIVACY AND ETHICS
The personal identifiers were cleared, and all the data were
anonymous according to ethical research standards.
c: INTERPRETABILITY AND TRANSPARENCY
SHAP and LIME systems to be used in visualizing the model
results.
d: COMPUTATIONAL COMPLEXITY
Decreased through model pruning, quantization, and edge-
computing techniques to improve the processing speed.
e: SCALABILITY
The modular architecture enables to be deployed in various
zones of the city and is not required to be reconfigured
structurally.
Such undertakings make the CDT framework strong, ethi-
cal, and scalable to enable reliable use of AI in practical use
of law enforcement.
III. DISCUSSION
The adoption of Artificial Intelligence (AI) and Machine
Learning (ML) as Cognitive Digital Twins (CDTs) has
demonstrated to be a revolutionary method of crime predic-
tion and analysis in cities. Cognitive modelling combined
with AI-based data analytics will help law enforcement agen-
cies to solve the issue of anticipating high-risk locations
and implementing preventative controls in advance. This
evaluation of the efficiency of some AI and ML models
within the framework of CDT explains the functions, per-
formance, and drawbacks of these models in practical urban
crime prediction. The use of AI and ML models in the
VOLUME 14, 2026
16797

--- Page 7 ---

T. C. Shiraptini et al.: AI and ML-Enabled CDT for Crime Hotspot Detection and Analysis
TABLE 2. Summary of recent AI and ML studies for crime prediction and their accuracy.
research of urban crime prediction is illustrated in Figure 4.
Convolutional Neural Networks (CNN) take 18% and Long
Short-Term Memory (LSTM) networks 15% followed by
Support Vector Machines (SVM) 12% and Generative Adver-
sarial Networks (GAN) 10% and Explainable AI models 8%
and Hybrid CNN-LSTM models 13% and other new mod-
els like Graph Neural Networks (GNN) and Transformer
architecture 10%. The given distribution emphasizes the fact
that both classical ML and modern deep learning methods
are actively developing in the field, both of which consider
specific elements of spatial-temporal crime prediction.
The CNN and LSTM models have demonstrated better
results in the detection of space-temporal trends of crime.
Geospatial heatmaps and patterns of hidden hotspots are
especially analysed with CNNs, and the relationship between
crime and socio-environmental factors, including population
density or urban structure. In the meantime, LSTM net-
works are also more effective at sequential crime events with
time, so the CDT can be used to predict the probability
of crime in the future, considering time-dependent infor-
mation. Hybrid CNN-LSTM has proven to be an effective
solution as both spatial and temporal learning are combined.
16798
VOLUME 14, 2026

--- Page 8 ---

T. C. Shiraptini et al.: AI and ML-Enabled CDT for Crime Hotspot Detection and Analysis
FIGURE 5. Distribution of AI and ML models Used in crime hotspot
detection.
These hybrid structures allow the CDT to have a real-
time predictive capability of how crime hotspots change
dynamically and allow predictions of how it can adjust to
changing urban behaviours. Likewise, Random Forests and
Support Vector Machines will remain essential in baseline
classification, they provide strong and interpretable forecasts,
especially on smaller or structured data. The implementa-
tion of Generative Adversarial Networks (GANs) within the
framework has contributed greatly to the dataset equilibrium
and the resistance of the model. GANs produce fake data
of underreported or infrequent crime occurrences, which
improves the data and enhances generalization. This strat-
egy will help resolve the long-standing issue of imbalance
between classes, and the minor categories of crimes usually
do not have enough training data available. SHAP and LIME
are some of the explainable artificial intelligence (XAI) mod-
els that improve the process of decision-making by making
predictions transparent and allowing stakeholders to under-
stand how AI is used to make predictions.
This ethical policing trait is essential, as well as the preser-
vation of societal trust in predictive policing systems. This
capability to justify model outputs makes them accountable
in automated decision making especially in sensitive law
enforcement situations.
Alongside the outstanding improvement, there are a num-
ber of obstacles. The interpretability and ethical use of AI
systems in the field of public safety is one of its limitations.
Although networks such as CNNs and LSTMs achieve great
accuracy, the fact that they are black box makes them ques-
tionable in terms of transparency and bias. This issue supports
the significance of integrating explainable AI models to make
model predictions interpretable, fair, and unbiased. The other
problem is the dynamics of the crime pattern that changes
according to the socio-economic changes, increase or decline
in urbanization, and seasonal changes. Even trained on large
datasets, it is possible to train them quickly and then get out
of date. Therefore, the CDT system should be structured to
be constantly learned, adjustments of the new information
streams and real-time sensor feeds are necessary to ensure the
relevance of the predictions. Further, data quality and privacy
are also important aspects. The predictability of crime is
dependent on the quality of input information and its stability.
Not all or unbiased datasets can cause defective hotspots
mapping or incorrect classification of crime intensity zones.
To achieve sustainable implementation, the balance between
predictive accuracy and privacy of the data and their ethical
use is critical.
Future studies should entail the further development
of multi-modal data integration, integrating textual data
(e.g., the sentiment of social media) with structured data
(e.g., police logs, sensor data). Additional features that might
enhance relational knowledge between crime events and
urban characteristics are the incorporation of graph-based
learning models and transformer architectures. Furthermore,
the creation of autonomous, self-learning CDTs will allow
adaptive recalibration when continuous feedback of real-
life data is obtained. One more prospective path is the
simulation by scenarios, where the CDT predicts the conse-
quences of hypothetical interventions, e.g. changing patrol
routes or putting up surveillance units. This would enable
the policymakers to experiment with strategies virtually and
make them operational to maximize safety and resource
utilization.
Table 2 is a synopsis of different AI and ML methodologies
that are used to predict crimes, their performance, applica-
tions and limitations in diverse studies.
IV. CONCLUSION AND FUTURE WORK
The study has shown that Artificial Intelligence (AI) and
Machine Learning (ML) implementation in Cognitive Dig-
ital Twin (CDT) systems offer a most efficient framework
of predicting crime and reporting hotspots at any point in
city settings in real-time. Integrating spatial, temporal and
behavioral information, CDTs turn traditional crime analysis
into a proactive and data-driven procedure that facilitates effi-
cient decision-making during law enforcement. The findings
of the present paper support the idea that AI-based CDT
frameworks are more accurate, flexible, and scalable than
traditional analytical tools, which is why they can be used
in contemporary smart-city ecosystems.
An application of AI models, including Convolutional
Neural
Networks
(CNNs),
Long
Short-Term
Memory
(LSTM) networks, and Generative Adversarial Networks
(GANs), in the CDT allows better perception of the crime
dynamics. CNNs are useful at determining the geospatial
patterns in urban structures, whereas LSTMs describe the
sequential and temporal relationship of crime events. GANs
are useful in balancing the dataset by synthesizing rare
events therefore enhancing model generalization and fairness.
Moreover, the CNN-LSTM architecture improves the learn-
ing of the spatio-temporal one, which gives more accurate
predictions of new crime hotspots. Such findings prove that
AI and ML-based CDTs can dynamically respond to real-
time sensor signals and constantly renew their knowledge
base as the urban conditions change.
VOLUME 14, 2026
16799

--- Page 9 ---

T. C. Shiraptini et al.: AI and ML-Enabled CDT for Crime Hotspot Detection and Analysis
Nevertheless, there are still a number of challenges. Model
interpretability is one of the key issues. Most DNNs are black
boxes, and the police analysts cannot easily comprehend what
causes a particular area to be considered a potential hot spot.
It is essential to incorporate Explainable AI (XAI) meth-
ods, including SHapley Additive exPlanations (SHAP) and
Local Interpretable Model-agnostic Explanations (LIME) to
be more transparent and accountable when making decisions
using AI. The interpretability does not only increase the trust
of law enforcement officers but also complies with ethical and
legal requirements when it comes to data-driven policing.
The other problem is the challenge of keeping the CDT
models relevant and accurate with time. There is dynamism
in the patterns of crime and it is affected by many external
factors like socio-economic shifts, seasonal shifts and devel-
opment of cities. Thus, predictive value of the static models
decays rapidly. Future CDT systems should have included
the continuous learning systems, that can update the model
weights automatically, re-train them using new data streams,
and re-calculate the hotspots probabilities in real time. Inclu-
sion of adaptive feedback loops, i.e. where the system learns
on the results of field and law enforcement reaction, will also
enhance accuracy and operational efficacy.
The privacy and management of data is also paramount.
Since CDTs are based on sensitive geographic and demo-
graphic data, high data anonymization, encryption, and eth-
ical standards are required to avoid abuse and guarantee the
community trust. Furthermore, it is possible to introduce stan-
dardized information pipelines across municipalities, police
departments, and urban sensors to enhance interoperability
and minimize information silos that are sources of issues
regarding updating real-time models.
In future studies, there are various ways that can be
explored. First of all, the combination of graph neural
networks (GNNs) and transformer-based models is poten-
tially more effective at the level of relational reasoning
among crime events, locations, and socio-environmental fac-
tors. Second, it is possible to use multi-modal data fusion,
i.e., a combination of textual data (social media posts) and
structured police data and real-time environmental data, that
would provide more context-based predictions. Third, it is
possible to investigate reinforcement learning to emulate and
test the usefulness of proactive policing policies, including an
adaptive patrol route or surveillance location, so that the CDT
can autonomously propose the most beneficial interventions.
Lastly, creating a real-time Smart City Command Interface
that is connected to the CDT may help to give the law
enforcement agencies interactive dashboards that simulate
the evolution of hotspots on the spot, patrol suggestions, and
predictive warnings in real-time. Such systems are coupled
with edge computing, which enables them to minimize the
response latency and deliver scalability in different urban
environments.
To sum it up, AI and ML-enabled Cognitive Digital Twins
is a revolutionary step toward smart cities in terms of safety
management. With constant learning on real time sensor data
and past crime trends, the CDTs can transform policing into
proactive rather than reactive paradigm. The ongoing studies
on explainability, data ethics, adaptive learning, and multi-
modal integration will need to be conducted to achieve the
potential of these systems. These AI-enabled systems may
become central to making cities smarter and safer, more
resilient, and data-empowered as cities increasingly become
smarter.
REFERENCES
[1] F. Khanam Bappee, A. Soares Junior, and S. Matwin, ‘‘Predicting crime
using spatial features,’’ 2018, arXiv:1803.04474.
[2] S. Gupta and S. Sayer, ‘‘Machine learning for public good: Pre-
dicting urban crime patterns to enhance community safety,’’ 2024,
arXiv:2409.10838.
[3] T. Zubair, S. K. Fatima, N. Ahmed, and A. Khan, ‘‘Crime hotspot predic-
tion using deep graph convolutional networks,’’ 2025, arXiv:2506.13116.
[4] A. Singh, N. Singhal, and P. Kumar, ‘‘Enhanced crime detection in smart
cities through hybrid machine learning and advanced feature extraction
techniques,’’ Int. J. Intell. Syst. Appl. Eng., vol. 12, no. 22s, pp. 110–118,
2024.
[5] K. Chiranjeevi, Y. Mutyala, V. Yeshwanth, P. U. Rani, and Y. Vikram,
‘‘Enhancing crime prediction using convolutional neural networks tech-
niques,’’ Int. J. Sci. Res. Sci. Technol., vol. 11, no. 2, pp. 405–411, 2025.
[6] N. Singh, ‘‘Predictive policing: A data-driven approach to crime prevention
in Delhi,’’ Int. J. Curr. Sci. Res. Pub., vol. 25, no. B11, pp. 120–128, 2025.
[7] P. Cichosz, ‘‘Urban crime risk prediction using point of interest
data,’’ ISPRS Int. J. Geo-Inf., vol. 9, no. 7, p. 459, Jul. 2020, doi:
10.3390/ijgi9070459.
[8] R. Konda, ‘‘Machine learning models for predicting crime hotspots in
urban areas using video surveillance,’’ Int. J. Innov. Res. Eng. Multidis-
ciplinary Phys. Sci., vol. 8, no. 5, pp. 45–52, Oct. 2020.
[9] A. Rao and P. Verma, ‘‘Predictive crime analytics: A machine learning
strategy for high-risk area identification and crime hotspot prediction,’’ Int.
J. Sci. Res. Eng. Manage., vol. 9, no. 8, pp. 1–9, Aug. 2025.
[10] S. Shaharuddin, K. N. A. Maulud, S. A. F. S. A. Rahman, and A. I. C. Ani,
‘‘Digital twin for indoor disaster in smart city: A systematic review,’’ Int.
Arch. Photogramm. Remote Sens. Spatial Inf. Sci., vols. XLVI-4/W3-2021,
pp. 315–322, 2022.
[11] P. Singh, ‘‘Digital twins in smart cities: A conceptual framework for urban
planning and sustainability,’’ Compusoft, Int. J. Adv. Comput. Technol.,
vol. 12, pp. 75–82, Jan. 2023.
[12] R. Al-Sehrawy, B. Kumar, and R. Watson, ‘‘A digital twin uses classifica-
tion system for urban planning & city infrastructure management,’’ J. Inf.
Technol. Construct., vol. 26, pp. 832–862, Nov. 2021.
[13] A. Sohail, B. Shen, M. A. Cheema, M. E. Ali, A. Ulhaq, M. A. Babar, and
A. Qureshi, ‘‘Beyond data, towards sustainability: A Sydney case study on
urban digital twins,’’ J. Photogramm., Remote Sens. Geoinf. Sci., vol. 93,
no. 4, pp. 365–377, Aug. 2025, doi: 10.1007/s41064-025-00337-y.
[14] Digital Twin for Public Safety and Security, Hexagon Geospatial, 2023.
[15] L. Becker and A. Kowalski, ‘‘Comparative analysis of digital twins in smart
cities,’’ in Proc. EGOV-CeDEM-ePart Conf., vol. 2024, pp. 115–126.
[16] Y. Fu, M. K. Turkcan, Z. Kostic, G. Zussman, and X. Di, ‘‘Digital twin for
pedestrian safety warning at a single urban traffic intersection,’’ Columbia
Univ. DITECT Lab Report, Lab 2024, 2024.
[17] V. Barrile, E. Genovese, C. Maesano, S. Calluso, and M. P. Manti, ‘‘Devel-
oping an urban digital twin for environmental and risk assessment: A
case study on public lighting and hydrogeological risk,’’ Future Internet,
vol. 17, no. 3, p. 110, Mar. 2025, doi: 10.3390/fi17030110.
[18] U. R. Maheshwari, R. Shankar, G. Chandrasekaran, and M. Kumar,
‘‘Assessment of cybersecurity risks in digital twin deployments in smart
cities,’’ Int. J. Comput. Experim. Sci. Eng., vol. 10, no. 4, pp. 89–95,
Oct. 2024.
[19] V. P. Orekoya, D. Mathias, E. O. Bennett, and V. I. E. Anireh, ‘‘CriPaaP:
A geospatial crime pattern analysis and prediction framework integrating
DBSCAN, enhanced LSTM, and ST-GNN for urban safety in Nigeria,’’
Int. J. Comput. Technol., vol. 12, no. 4, pp. 220–229, 2025.
[20] H. Terashima-Marín, M. S. Wajid, A. Zafar, M. A. Wajid, and B. Bhushan,
Digital Twins for Smart Cities and Urban Planning: From Virtual To
Reality. Boca Raton, FL, USA: CRC Press, 2025.
16800
VOLUME 14, 2026

--- Page 10 ---

T. C. Shiraptini et al.: AI and ML-Enabled CDT for Crime Hotspot Detection and Analysis
[21] Z. Beiji, N. Mohammed, Z. Chengzhang, and Z. Rongchang, ‘‘Crime
hotspot detection and monitoring using video based event modeling
and mapping techniques,’’ Int. J. Comput. Intell. Syst., vol. 10, no. 1,
pp. 962–969, 2017, doi: 10.2991/ijcis.2017.10.1.64.
[22] G. Mohler, M. Porter, J. Carter, and G. LaFree, ‘‘Learning to rank spatio-
temporal event hotspots,’’ Crime Sci., vol. 9, no. 1, Dec. 2020, doi:
10.1186/s40163-020-00112-x.
[23] A. Maurya, A. Jaiswal, A. Kumar, A. Kumar, and S. Pippal, ‘‘AI-powered
local crime prediction,’’ Int. J. Innov. Sci. Res. Technol., pp. 2749–2753,
May 2025.
[24] Crime Report Digital Twin, Visual Analytics and Robotics Lab, 2024.
[25] L. Deren, W. Yu, and Z. Shao, ‘‘Smart city based on digital twins,’’ Comput.
Urban Sci., vol. 1, no. 1, 2021, doi: 10.1007/s43762-021-00005-y.
[26] J. Argota Sánchez-Vaquerizo, ‘‘Urban digital twins and metaverses
towards city multiplicities: Uniting or dividing urban experiences?’’ Ethics
Inf. Technol., vol. 27, no. 1, pp. 213–225, Mar. 2025, doi: 10.1007/s10676-
024-09812-3.
[27] L. A. Remotti, ‘‘IoT innovation clusters in Europe and the case for public
policy,’’ Data Policy, vol. 3, 2021, doi: 10.1017/dap.2021.16.
[28] N. Zali, A. Soltani, P. Najafi, S. E. Qajari, and M. Mehrju, ‘‘Digital twins
for smarter Iranian cities: A future studies perspective,’’ Comput. Urban
Sci., vol. 4, no. 1, p. 43, Dec. 2024, doi: 10.1007/s43762-024-00155-9.
[29] A. Sarker and B. Kumar, ‘‘Digital twins and AI integration for smart
urban systems: Review and future directions,’’ IEEE Access, vol. 12,
pp. 98320–98345, 2024, doi: 10.1109/ACCESS.2024.3456738.
[30] T. Y. Lee and H. Kim, ‘‘Cognitive digital twins: Enhancing intelligence
in smart city applications,’’ IEEE Internet Things J., vol. 10, no. 7,
pp. 6123–6135, 2023, doi: 10.1109/JIOT.2023.3347821.
T. C. SHIRAPTINI is currently pursuing the
M.Tech. degree in software engineering with
Vellore Institute of Technology (VIT), Chennai.
Under Indian Patent Office, she has a published
patent ‘‘Wearable Device to Predict Risk of Cere-
brovascular Event and Method Thereof.’’ She is
also proficient in Python, C, C++, and Java.
Her creative endeavors wants to create predictive,
intelligent software that works to solve problems
in the real world with her passion to be in health-
care technology. Her research interests include machine learning, software
engineering, and cyber-physical systems.
KAVITHA DHANUSHKODI received the Master
of Engineering and Ph.D. degrees in computer
science and engineering from Anna University,
Chennai. She is currently an Associate Professor
with the School of Computer Science and Engi-
neering (SCOPE), Vellore Institute of Technology,
Chennai Campus, Chennai, Tamil Nadu, India.
She has an overall teaching experience of 16 years
in various academic institutions. She has published
more than 42 research articles to her credit in
reputed journals. Her research interests include software security, the Internet
of Things, and cyber security.
S.
SAKTHIPRIYA
is currently pursuing the
M.Tech. degree in software engineering with
Vellore Institute of Technology (VIT), Chennai.
She is a good Python and C, C++, and Java
Programmer with technical interests in machine
learning, software engineering, and cyber-physical
systems. The projects employed in her academic
and technical contributions are a smart helmet to
be used by coal miners and a system of personal
finance management. Under Indian Patent Office,
she has published patent ‘‘Wearable Device to Predict Risk of Cerebrovas-
cular Event and Method Thereof.’’ As her interest in technology in the
healthcare field and the predictive analytics field continues to increase, she
seeks to create smart and socially transformative software systems that solve
real-world problems and constantly improve her technical skills.
S. AKSHAYA is currently pursuing the M.Tech.
degree in software engineering. Her techni-
cal knowledge is in Python, Java, C, C++,
and Web Development. Her research interests
include intelligent software systems, machine
learning, and data science. She has written a
patent titled ‘‘Wearable Device to Foretell Risk
of Cerebral Vascular Infraction and Technique
Thereof’’ (Office of the Controller General of
Patents Designs and Trademarks Government of
India). She has also developed technology-based projects, such as a Smart
Helmet to Coal Miners. Her continued practice is based on the application
of data-driven and AI-based to solve real-world problems.
SHERLY ALPHONSE received the B.E. degree
from Manonmaniam Sundaranar University and
the M.E. and Ph.D. degrees in affective computing
from Anna University, in 2018. She is currently
an Associate Professor with Vellore Institute of
Technology, Chennai. She has proposed various
novel pattern recognition algorithms for facial
expression recognition and has published various
articles in recognized international journals. She
has published various book chapters on the IoT
and blockchain. She has various patents published on image processing in
the fields, such as detecting abnormalities in the liver which is a major
contribution in the field of the health sector. She has also published patents,
namely ‘‘A Robotic Device for Killing Bedsheet Bacteria’’ and ‘‘Mathemat-
ical Application Technology for IoT Data Analysis and Optimization.’’ Her
research interests include image processing, machine learning, and facial
expression analysis. She is a Lifetime Member of IAENG.
VOLUME 14, 2026
16801
