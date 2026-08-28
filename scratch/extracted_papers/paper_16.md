--- Page 1 ---

Received 11 July 2023, accepted 18 August 2023, date of publication 28 August 2023, date of current version 5 September 2023.
Digital Object Identifier 10.1109/ACCESS.2023.3308967
Multimodal Deep Learning Crime Prediction
Using Tweets
SAKIRIN TAM
1 AND ÖMER ÖZGÜR TANRIÖVER
2
1Information Communication Technology Department, University of Puthisastra, Phnom Penh 120204, Cambodia
2Computer Engineering Department, Ankara University, 06830 Ankara, Turkey
Corresponding author: Sakirin Tam (kirin.it@gmail.com)
ABSTRACT Crime prevention relies on crime prediction as a crucial method to determine the most effective
patrol strategy for law enforcement agencies. Various approaches and solutions have been utilized to predict
criminal activity. Nonetheless the environment and nature of information for crime prediction is constantly
changing. The utilization of social media for sharing information and ideas has experienced a significant
surge. Twitter, in particular, is regarded as a valuable platform for gathe ring public sentiments, emotions,
perspectives, and feedback. In this regard, techniques for analyzing the sentiment of tweets on Twitter have
been developed to ascertain whether the textual content conveys a positive or negative viewpoint on crime
incident. Data fusion is a significant technique to integrate the information from crime and tweets data
source. Therefore, this study aims to leverage semantic knowledge learned in the text domain and historical
crime data, and transfer them into a model trained crime prediction. We applied data fusion technique to
ConvBiLSTM model to extract independent vector from tweet and crime modalities and fuse them into
a single representation that captures the information from all modalities. This study involved collecting
and conducting experiments using two datasets. The first dataset consisted of crime incident data obtained
from the Chicago police department, specifically covering the period between September 1 and September
30, 2019. The second dataset comprised tweets containing crime-related terminology specific to Chicago.
To evaluate the performance of our model, we benchmarked with latest crime prediction models, including
SVM, Logistic Regression, NAHC, DNN with feature-level data fusion, CrimeTelescope, ANN+BERT, and
BERT-based crime prediction models. The experimental result showed that our ConvBiLSTM model using
multimodal data fusion demonstrates superior performance compared to other traditional deep-learning and
BERT models with an accuracy of 97.75%.
INDEX TERMS Multimodal, data fusion, sentiment analysis, crime prediction, neural network.
I. INTRODUCTION
Crime detection and prediction have emerged as significant
and crucial practices in crime analysis, aiming to determine
the most effective patrol strategy for law enforcement agen-
cies. Numerous researchers have explored various techniques
and solutions utilizing data mining methods to analyze crime.
These studies have the potential to streamline and automate
the crime analysis process, resulting in increased efficiency
and accuracy.
The associate editor coordinating the review of this manuscript and
approving it for publication was Chuan Li.
Nevertheless, the nature of crime patterns is dynamic rather
than static, consistently evolving and expanding [1]. Social
media platforms facilitate public discussions and postings,
generating textual data that contains contextual information
about users’ daily activities. These unstructured posts present
valuable data that can be leveraged for crime prediction.
Sentiment analysis, also known as opinion mining, employs
text analysis and computational linguistic techniques within
the field of Natural Language Processing (NLP). Its objective
is to identify, extract, and classify subjective information
from unstructured text [2]. The primary goal of sentiment
analysis is to determine the polarity of sentences by extracting
word clues from the sentence context [3], [4], [5]. Hence,
93204
This work is licensed under a Creative Commons Attribution 4.0 License. For more information, see https://creativecommons.org/licenses/by/4.0/
VOLUME 11, 2023

--- Page 2 ---

S. Tam, Ö. Ö. TanriÖver: Multimodal Deep Learning Crime Prediction Using Tweets
sentiment analysis has gained significant recognition as a
valuable technique for extracting meaningful insights from
unstructured data sources, such as tweets or reviews. In the
business domain, companies utilize sentiment analysis to
gain an understanding of customer feedback regarding their
products or services. Similarly, in politics, sentiment analysis
serves as a decision-making tool to examine public reactions
to political events. Various social media platforms, includ-
ing Twitter, Facebook, Instagram, blogs, reviews, and news
websites, enable individuals to widely share their opinions
and reviews. The number of Twitter users has grown from
140 million in 2012 to 353.9 million active users in 2023,
with approximately 237 million daily active twitter users [6].
These tweets harbor valuable hidden information that can
be utilized to ascertain the author’s attitude and contextual
polarity within the text [7], [8]
Crime prediction utilizing sentiment analysis has emerged
as an effective approach in recent years [9]. By leveraging
sentiment analysis techniques on various data sources such as
social media posts, news articles, or online reviews, valuable
insights can be derived regarding public attitudes, emotions,
and opinions related to crime. Sentiment analysis enables the
identification and classification of text as expressing positive,
negative, or neutral sentiment, providing a deeper under-
standing of the prevailing sentiments associated with criminal
activities or specific locations. Integrating sentiment analysis
into crime prediction models allows law enforcement agen-
cies to gauge the public’s perception of safety and allocate
resources more effectively. Additionally, sentiment analy-
sis can assist in early detection of emerging crime trends,
enabling proactive measures to be taken for crime prevention
and ensuring the safety and security of communities.
On the other hand, data of a particular phenomenon or
system can be derived from various tools, measurement
techniques, experimental setups, and other sources. Given
the diverse characteristics of societal processes and environ-
ments, it is rare that a single data acquisition method could
offer a comprehensive understanding of the phenomenon.
As multiple datasets, obtained through different acquisition
methods, become more accessible, new possibilities arise,
leading to questions that go beyond analysing each dataset
independently [10]. Data fusion refers to the merging of
data from various modalities offering distinct perspectives
on a shared phenomenon, is employed to address inference
problems. It holds the potential to resolve such problems with
fewer errors compared to unimodal approaches [11]. Data
fusion provides several advantages, including complemen-
tary, redundant, and cooperative features [12], [13]. In this
regard, data fusion could help the study to achieve better
performance of crime prediction using different sources of
data including tweets and crime incident must.
Therefore, this study aims to overcome the drawbacks of
the studies found in crime model and utilize the benefit of
data fusion technique to develop deep learning multimodal
using real time tweets and crime data for crime prediction.
We apply our sentiment base deep learning model that we
have developed in an earlier study called ConvBiLSTM [14].
The word feature from tweets and crime modalities are
extracted independently at vector level and fused into a single
representation that captures the information from all modal-
ities. The strength of ConvBiLSTM is that it provides extra
training by traversing the data twice from left to right and
right to left, there by extracting the vector of the words in
context of the information preceding and succeeding it and
therefore can capture long term contextual dependencies and
global features from the sequential data.
The structure of this paper is as follows: Section II provides
literature review of relevant study. Details of propose archi-
tecture of the model are explained in Section III. Result and
discussion is explained in Section IV. Finally, the possible
research improvement to the study and conclusion is provided
in Section V.
II. LITERATURE REVIEW
This section introduces literature on existing study including
multimodal data fusion, crime modalities, sentiment modali-
ties, and deep learning model.
A. MULTIMODAL DATA FUSION
Multimodal data fusion has a rich research history that
can be traced back to audio-visual speech recognition,
which was inspired by the well-known McGurk effect [15].
Over time, researchers from various communities, includ-
ing speech recognition, multimedia content indexing and
retrieval, and multimodal interaction, have proposed numer-
ous methods [16], [17], [18], [19], [20]. However, due to the
limited model capacity of traditional approaches, the popu-
larity of research in multimodal data fusion experienced a lull
for a certain period. In recent times, the emergence of deep
learning techniques has revitalized the field of multimodal
data fusion, presenting new opportunities and avenues for
exploration [21].
The methods of multimodal data fusion can be broadly
categorized into three groups based on the level of
fusion, namely pixel-level fusion, feature-level fusion, and
decision-level fusion [22]. Some methods combine elements
from these categories. Pixel-level fusion involves directly
processing the original multimodal data without performing
feature extraction, such as adding pixel values from video
inter-frame difference images and original audio waveform
diagrams [23]. Pixel-level fusion is a general yet coarse data
fusion approach. However, it is seldom used as a standalone
method in research models due to its challenging nature
in calculating and discovering meaningful information and
relationships. Moreover, pixel-level fusion suffers from poor
scalability when dealing with high-dimensional multimodal
data.
Feature-level fusion involves integrating features imme-
diately after their extraction, often utilizing techniques like
principal component analysis (PCA) and linear discriminant
analysis (LDA) to reduce the dimensionality of the feature
VOLUME 11, 2023
93205

--- Page 3 ---

S. Tam, Ö. Ö. TanriÖver: Multimodal Deep Learning Crime Prediction Using Tweets
set. For instance, Donahue et al. [24] incorporated a Long
Short-Term Memory (LSTM) neural network on top of a
convolutional neural network to combine temporal and spatial
information in videos. Wu et al. [25] introduced a semantic
consistency classification loss function in an early fusion
architecture to handle semantic conflicts between modalities,
resulting in improved performance. Dai et al. [26] proposed
CADNNs, an architecture that embeds prior knowledge into
deep neural networks, and applied it to a multimodal deep
architecture for traditional Chinese medicine diagnosis [27].
On the other hand, decision-level fusion, which repre-
sents the highest level of fusion, combines information
from each modality after individual decisions have been
made. Decision-level fusion employs simple fusion mech-
anisms such as averaging [28], weighting [29], or voting
schemes [30] to calculate synthetic values for each modality’s
decision. Although the fusion process at the decision level
may appear straightforward, it can lead to the loss of low-level
intermodal information.
B. CRIME MODALITIES
Recent research endeavours have sought to incorporate
Twitter data into predictive models for crime prediction. The
objective behind integrating Twitter data for crime predic-
tion is to leverage the wealth of information available on
the platform regarding users’ social behaviours. Geber [10]
is credited as the pioneer in incorporating social media
content to model crime prediction. Geber utilized Latent
Dirichlet Allocation (LDA) on tweets to explore the rela-
tionship between tweet content and crime patterns in specific
locations. The results showed an improvement compared to
models solely relying on traditional historical crime predic-
tors for stalking, criminal damage, and gambling. However,
Geber’s use of LDA, an unsupervised learning technique,
presents challenges as the correlations between word clusters
and crimes are not driven by pre-existing theoretical insights.
Consequently, the correlations generated may appear rela-
tively insignificant.
Wang et al. [31] employed a novel approach by extracting
event-based topics from real-time tweets to predict hit-and-
run incidents in Virginia. However, their data source was
limited to a manually selected set of news portals, neglecting
the vast amount of information contributed by citizens.
Chen et al. [32] incorporated sentiment analysis of tweets
along with weather data using Kernel Density Estimation
(KDE) to predict thief occurrences in terms of time and
location. Nevertheless, their study was constrained to spatial
information such as weather data for specific timeframes and
locations. Moreover, it was concluded that KDE, being a
location-dependent technique, cannot be easily generalized
as certain types of crimes may not follow patterns established
by previous incidents, and the population of an area can
frequently change.
Brandt et al. [33] explored the correlation between mobile
populations captured through Twitter’s geotagging feature
and the occurrence of various types of crime. They found
that the absence of tweets was indicative of assaults and
thefts. However, these studies primarily focused on geoloca-
tion data, disregarding the textual content of tweets.
Similarly, Malleson and Andresen [34] employed geo-
graphic analysis methods to model crime risk using tweets
from mobile populations. However, the drawback of these
studies was the lack of consideration given to tweet text, as the
focus was solely on geolocation data.
Zainuddin et al. [35] implemented sentiment analysis on
crime-related tweets using a model based on Natural Lan-
guage Processing techniques and SentiWordNet. This model
had the capability to detect the subjectivity of crime and
predict crime based on the presence of hate tweets.
Pang et al. [36] conducted a comparative study utilizing
algorithms such as Naïve Bayes, Support Vector Machine,
and Maximum Entropy to determine sentiment polarity in
movie reviews. These studies proved effective but overlooked
the semantic aspect, failing to capture the meaning embedded
within the tweets.
Based on previous researches, there are two assumptions
can be made; first the publicly available data from Twitter
do include features that can portray a correlation between
crime pattern predicted from tweets and the actual crime inci-
dents reported. Second, estimation models including social
media variables will increase the amount of crime variance
explained compared to models that include ‘offline’ variables
alone.
C. DEEP LEARNING
Deep learning algorithms have achieved remarkable results
in natural language processing area. They represent data
in multiple and successive layers. They have the ability to
capture the syntactic features from sentences automatically
without extra feature extracting techniques, which consume
more resource and time. This is the reason why deep learning
models have attracted attention from NLP researchers to
explore sentiment classification.
By making use of a multi-layer perceptron structure in deep
learning, CNN can learn high-dimensional, non-linear, and
complex classification. As a result, CNN is used in many
applications such as computer vision, image processing,
and speech recognition [37], [38]. Kalchbrenner and Blun-
som [39] designed Dynamic Convolution Neural Network
(DCNN) model for text processing. Kim et al. [40] proposed
English text classification by taking word vectors as input
into CNN to get sentence-level classification. Even though
CNN achieves good results in text classification, it mainly
focuses on extracting local features and pays no attention
to the context of words, which have much impact on the
performance of text classification results [41], [42]. From
this motivation of work, an integrated model of CNN with
Bi-LSTM was proposed.
Automating the learning and expressing features in neu-
ral network enables RNN to integrate the adjacent location
93206
VOLUME 11, 2023

--- Page 4 ---

S. Tam, Ö. Ö. TanriÖver: Multimodal Deep Learning Crime Prediction Using Tweets
of information in NLP effectively. Long Short-Term Mem-
ory (LSTM) is one of RNN models [43] that can build a
large-scale structure of neural network. LSTM makes good
use of memory to avoid gradient problems in RNN [44].
In contrast to CNN and LSTM, RNN pays more attention
to context of feature information and can fit into non-linear
relations while retaining the sequential of text informa-
tion [45], [46]. Also, Bidirectional RNN is another type of
neural network models that is widely used in text classifi-
cation [47]. Bidirectional RNN works as the combination
of two RNN models; backward and forward hidden layers
to improve the performance of RNN neural network model.
This approach can learn semantic information of words better
because word semantics are correlated with preceding and
succeeding information of the words.
D. CONVOLUTIONAL NEURAL NETWORK
CNN is a multi-layer feed-forward neural network which
improves the error in backpropagation network (BP) and
reduces computation time and complexity of BP [48], [49].
It is recently used for sentiment classification because it can
recognise local features by using convolution kernel, and
automatically learns these features for classification solution.
CNN model consists of three main layers; convolution layer,
pooling layer, and fully connected layer [50]. Sentences are
converted into a matrix of numbers and input to the convolu-
tional layer. Each sentence consists of words or tokens, and
each token is corresponded to a row or vector on the matrix
table. These vectors are typically generated by embedding
techniques such as the Word2Vec and GloVe model.
CNN model takes the input of vectors and extracts local
feature using filters. The most computations of features are
performed in convolutional layer which is the most important
layer in CNN. Convolutional layer produces feature maps
using a function called convolution kernel.
After the convolution operation, pooling layer extracts the
most important features. The pooling layer calculates local
sufficient statistics. This process allows the pooling layer to
reduce feature dimensions, makes CNN achieve computa-
tional time and cost reduction, and prevents the model from
overfitting problem. Finally, the fully connected layer pro-
duces a probability distribution to classify sentiment results.
E. LONG SHORT TERM MEMORY
RNN is one of deep learning algorithms which is mainly used
in NLP to predict the next word base on previously given
words in a sentence. RNN also uses back-propagation as other
traditional neural networks. However, RNN suffers from gra-
dient exploding and vanishing problems. These two problems
make RNN hard to train and fine-tune parameters. These
problems normally occur during back-propagation process.
Long Short Term Memory (LSTM) is an RNN model to
improve the problems mentioned above.
LSTM modifies the structure of RNN. It reconstructs RNN
layer into a structure that contains a gate and a memory
unit. The purpose of LSTM is to keep the information in
the memory cell for further utilisation and update. With
this new structure, LSTM solves the problems of gradient
exploding and vanishing problem in RNN. Moreover, it is
more promising to apply LSTM to solve sentiment analysis
problems because its variants can capture long short-term
dependencies.
F. BIDIRECTIONAL LSTM
Bi-LSTM is one of RNN algorithms to improve LSTM which
has shortcomings of text sequence features. It solves the
task of sequential modelling better than LSTM [51], [52].
In LSTM, information is flowed from backward to forward,
whereas the information in Bi-LSTM flows in both direc-
tions; backward to forward and from forward to backward by
using two hidden states. The structure of Bi-LSTM makes it
a pioneer in sentiment classification because it can learn the
context more effectively. Figure 2 shows the architecture of
Bi-LSTM [53]. By utilising two ways of direction, input data
of both preceding and succeeding sequence in Bi-LSTM are
retained, unlike the standard RNN model that needs decay to
include future data.
G. SENTIMENT MODALITIES
The objective of sentiment analysis is to uncover the
expressed polarity within text, which involves interpreting
opinions or emotions conveyed in both spoken and written
language to determine the positive or negative sentiment. This
analysis is particularly valuable in assessing the mood of
stock investors. Sentiment analysis, a text mining and NLP
method that examines subjective sentiments, holds significant
importance in various domains such as product recommenda-
tions, healthcare, politics, and surveillance. In a forthcoming
survey on predictive modelling using social media, Kalam-
pokis et al. identified seven application areas covered by
52 published articles [54]. These areas include predicting
or detecting disease outbreaks [55], election results [56],
macroeconomic processes [57], box office performance of
movies [58], natural phenomena like earthquakes [59], prod-
uct sales [60], and financial markets [61]. The primary
technique employed in these studies is sentiment analysis,
where researchers perform semantic analysis on the contex-
tual contents of each tweet to extract predictive insights from
a selected group of individuals.
The study conducted by Wang et al. closely relates to the
current research as they utilized tweets obtained from local
news agencies [62]. They discovered initial evidence suggest-
ing that these tweets have the potential to predict hit-and-
run vehicular accidents and breaking-and-entering crimes.
However, it is important to note that they only considered
tweets from specific news agencies that were hand-selected.
These tweets, authored by professional journalists, were rel-
atively straightforward to analyse using existing text analysis
techniques. However, this approach came at the cost of
VOLUME 11, 2023
93207

--- Page 5 ---

S. Tam, Ö. Ö. TanriÖver: Multimodal Deep Learning Crime Prediction Using Tweets
disregarding hundreds of thousands of potentially significant
messages.
III. PROPOSED METHOD
Our objective is to leverage semantic knowledge learned in
the text domain and historical crime data, and transfer it
to a model trained crime prediction. We utilize our earlier
developed model call ConvBiLSTM. The motivation of this
model was to combine the strength from both CNN model and
BiLSTM model. The study result of ConvBiLSTM proved
that it could provide extra training by traversing the text twice
from left to right and right to left, there by extracting the
vector of the words in context of the information preceding
and succeeding it and therefore can capture long term con-
textual dependencies and global features from the sequential
text [14].
ConvBiLSTM model consists of 6 layers are including
word embedding or word vectorization, convolutional layer,
max-pooling layer, BiLSTM layer, fully connected layer and
result. Since the objective of the study is to leverage the
knowledge learn in the text domain from two pre-trained
neural network models, and transfer it to a model trained
for prediction crime. Data fusion technique is added to the
ConvBiLSTM model before BiLSTM layer. Data fusion layer
is added to CNN model and before BiLSTM because it can
fuse the vectors which are obtained from convolutional layer
and max-pooling layer and fuse and put them into a single
vector representation. This single vector representation will
be inputted to BiLTM model and finally produce an output.
Figure 1 illustrated the conceptual model with the use of
data fusion layer. The word embedding vectors learn the
language model from both crime and tweet. The meaning
of the tweet and crime data are summarized through con-
volution and pooling layer, and are constructed as a single
representation of deep crime-semantic model by fusing the
vector feature to capture the information from both crime and
tweets data and train them to predict the crime. Detail of each
layer are discussed in the following section.
A. WORD VECTORIZATION
In this phase, the network takes the input of crime data and
tweet data independently, and segments into word or token
one by one. Each token is converted into a vector of numeric
values. Word2Vec pre-trained word embedding models is
used to generate word vector matrix. If each text of n words
is represented as T = {w1, w2, . . . , wn}, then each word is
converted into word vector of d dimension, the text of input
is defined as:
T = {w1, w2, . . . , wn} ∈Rn∗d
(1)
Since the individual text of input have different lengths,
its length needs to uniform (l). Its length was padded with
zero-padding strategy. Text which has a length longer than
the predefined length l will be truncated. But, if the text
which has length shorter than l, zero padding will be added
to the length. Therefore, all texts have the same dimension of
matrix. Each text of l dimension is defined as follows:
T = {w1, w2, . . . , wn} ∈Rl∗d
(2)
B. CONVOLUTIONAL LAYER
CNN model is good at extracting the most important words
from tweets or sentences [38] and the convolution layer is the
main step in CNN model. The word vectors matrix T ∈Rl∗d
from word embedding layer are fed into one-dimensional
convolution layer. In one-dimensional convolution layer, the
convolution word vector matrix is calculated through N filters
and width q of convolution kernel to construct the local
feature of n-gram. Filter Fn, where 1 ≤n ≤N generates
feature maps as follows:
cn
i = f (wn ⊗Xi:i+w−1 + bn)
(3)
Weight matrix of filter Fn is defined as w ∈Rq∗d, and
bn is the bias of filter Fn, d is word vector dimension, and
⊗is convolution operation, Xi:i+q−1 indicates that filter Fn
extracts feature Xi:i+q−1 from Xi, f is non-linear activation,
and the output of feature map of Fn filter is cn
i where ith is
element of cn. In this study, RELU function was applied to
non-linear activation f . For the sentence with length l, the
following feature maps were obtained:
c = [c1, c2, . . . , ci, cl]
(4)
C. MAX-POOLING LAYER
Once convolution operation produces feature maps, pooling
layer then extracts the most important features ˆc = max{c} to
calculate the local sufficient statistics. One-dimensional max-
pooling converts each kernel size of input into a single output
of the maximum number to reduce or down-sample version
of the input. This is the reason why CNN model effectively
reduces the number of features to prevent overfitting, also
reduces time and complexity of parameters.
D. DATA FUSION LAYER
Feature level data fusion is applied in the study; it refers
to the process of combining or integrating information from
multiple sources or modalities at the level of extracted fea-
tures. It involves extracting features independently from
each modality and then merging them to create a unified
feature representation that combines information from all
sources. In feature-level fusion, the focus is on combining
the extracted features rather than the raw data itself. The
aim is to capture complementary information from different
modalities or sources, creating a more comprehensive and
informative representation for further analysis or decision-
making. The fused data is computed as the average value of
the individual data sources. The mathematical expression is:
Fused Data = (Data1 + Data2 + . . . + Datan)/n
(5)
where Data1, Data2, ..., Datan are the individual data
sources, and n is the total number of data sources.
Before fusion, data pre-processing is conducted to ensure
consistency and remove noise, including tokenization,
93208
VOLUME 11, 2023

--- Page 6 ---

S. Tam, Ö. Ö. TanriÖver: Multimodal Deep Learning Crime Prediction Using Tweets
FIGURE 1. Conceptual multimodal data fusion for crime prediction using tweets.
removing stop words, stemming or lemmatization, and han-
dling special characters or punctuation. Then, features are
extracted from text data using word embedding; word2vec
to capture the semantic meaning of words by representing
them as dense vectors in a continuous space. The features are
normalized to ensure compatibility and have the same scale
range. Once the features are extracted and normalized, they
can be fused to create a unified representation. Concatenation
feature fusion is performed to concatenate into a single fea-
ture vector, combining the information from both crime and
tweet features. The fused feature representation is then used
as input for the desired analysis of crime prediction.
E. BI-LSTM LAYER
In contrast to LSTM, Bi-LSTM allows the information to
flow in both directions; backward to forward and from for-
ward to backward by using two hidden states. This can help
Bi-LSTM to learn the context better. By utilising these two-
way directions, input data of both past and future information
will be retained, whereby the standard RNN model needs
decay to include future information. The principle implemen-
tation of Bi-LSTM is as; two opposite directions of LSTM
network are connected to one output. The past information is
obtained by forward LSTM state and the following informa-
tion is obtained by backward LSTM state. This structure helps
the network to retain preceding and succeeding information.
The sequence output of the first layer in Bi-LSTM is the input
of the second layer, and the sequence output of the second
layer is the concatenation of the last unit output of forward
and backward layers. After stacked Bi-LSTM layers, the final
output is h:
h = [hforward, hbackward]
(6)
F. DENSE LAYER AND RESULT
Dense layer is used in the model to connect each input with
every output by using weights. Sigmoid is a function used in
the final layer to produce the output. It takes the average of
the random results into 1 and 0 forms. The prediction result
of sigmoid function is presented in Equation (6). the result
of sentiment is classified into either 0 or 1 by using binary
cross-entropy. In this study, 0 represents a crime incident and
1 represents a non-crime incident.
Y = sigmoid(wh + b)
(7)
IV. EXPERIMENT
A. DATASETS
Two datasets were used in the study, first is the five crime
types incident data including theft, battery, burglary, rob-
bery, and motor vehicle theft. The second data is the tweet
data associate with crime terminologies of the above crime.
Crime incident dataset used is collected from Chicago city
between 1-30 September 2019 via Chicago data web por-
tal (https://data.cityofchicago.org/). The dataset consists of
22418 crime incidents.
Figure 2 shows the categories of past crime from the
dataset. It can be seen that crimes are not equally distributed
among categories but there is a huge difference between them.
Theft crime is the most occurring crime happened in Chicago,
with the incident number of more than 5000 (or 24.23%) fol-
low by second most incident crime which is battery 19.46%.
Tweet dataset were collected from Twitter for the same
window of time in Chicago, using python library called
GetOldTweet. Total number of 398170 tweets were capture
from the tweet. These tweets contain both crime terminology
related public tweets and general public tweet in Chicago.
Since the most past crime is theft and its similar crime types
such as battery, burglary, robbery, and motor vehicle theft,
we investigate these crime types in our crime prediction
model. We investigated in detail to these crime types, the
tweets which contain crime terminology such as theft and
its synonym were extracted from the general tweets for the
experiment. Crime terminology are including ‘theft’, ‘crime’,
VOLUME 11, 2023
93209

--- Page 7 ---

S. Tam, Ö. Ö. TanriÖver: Multimodal Deep Learning Crime Prediction Using Tweets
FIGURE 2. Categories of incident crime.
TABLE 1. Sample of tweets.
‘battery’, ‘steal’, ‘burglary’, ‘robbery’, and ‘‘motor vehicle
theft’’. A total number of 14,336 of tweets were extracted
from the whole tweets. Table 1 shows the sample tweets
collected from twitter.
B. DATA PRE-PROCESSING
Data pre-processing is the most crucial step in NLP because
the raw dataset always consists of words or symbolst hat
cannot be directly used by learning models. We started by
removing @-mentions, Retweets represented as ‘RT’, links,
and hashtags symbols using regular expressions as these
things do not add any sort of value. A point to be noted here is
that we made sure to not remove any words after the hashtag
as it can contain a valuable reference to the sentiment of the
tweet. For example: in #istandwith farmer, even though the
symbol ‘#’ does not add any positive or negative value to our
TABLE 2. Hyper-parameters setting.
analysis, the text ‘‘I standwith farmers’’ gives us insight into
the state of the mind of the user. Further, the tweets contain-
ing special characters, punctuation, numbers, and emoticons
were also removed.
Tokenization is defined as separating quantities of text into
smaller units called tokens [28]. Tokenization is a funda-
mental step in modelling text data. It helps prepare the data
before vectorization for understanding the meaning behind
the text by analysing the sequence of the words. We used the
porter stemmer method to reduce the inflection towards their
root forms. This was done by stripping the suffix to produce
stems [29]. Lastly, the fully pre-processed tweets were stored
in a new pandas column called ‘‘stem_tweets’’ in our existing
data frame of tweets and crime datasets.
C. HYPER-PARAMETERS SETTING
In many cases, the model may produce less accuracy or even
produce overfitting or under-fitting. To obtain high model
performance, conducting hyper-parameters tuning is very
critical. Therefore, the randomised search strategy was used
to tune hyper-parameter and optimise the accuracy. Table 2
describes the hyper-parameters value in the proposed model.
V. RESULT AND DISCUSSION
This section covers the visualization and analysis result of
the model. Figure 3 shows the word cloud obtained from the
cleaned tweets. Word Cloud is a pictorial representation of
commonly used words in a particular dataset. We provided
our dataset of cleaned tweets to the model to generate this
word cloud. The entire word cloud represents the most fre-
quently used words. The words with a larger font occur more
commonly than the words with a smaller font. The word cloud
can give us an overview of the theft crime. It can also help us
in understanding the essence of the crime. In our word cloud
of cleaned tweets, the words that occur most frequently are
93210
VOLUME 11, 2023

--- Page 8 ---

S. Tam, Ö. Ö. TanriÖver: Multimodal Deep Learning Crime Prediction Using Tweets
FIGURE 3. Word cloud of the tweets.
grand theft, employee theft, cargo theft, high crime, theft auto
and many others. While the words like theft bring to light
the common motive of the tweets, the words like cargo and
employee indicate that people were tweeting in expressing
the theft happened related to cargo and employee. A copious
number of words like steal, business damage, theft occurs,
chance theft and theft spell have been mentioned which reveal
that Twitter users expressed the concern of increasing theft.
A. BASELINE COMPARISON
To evaluate the performance of our multimodal deep learning
for crime prediction, we employed some existing methods for
crime prediction comparison:
• SVM: conduct a crime prediction on crime data set,
without considering tweet data.
• Logistic Regression: apply crime data set to prediction
crime data, without considering tweet data
• Sentiment Based SVM: to prediction crime data, senti-
ment score of the associate tweet were added to crime
data.
• Sentiment based Logistic Regression: sentiment score
of the associated tweet were added to crime data set for
crime prediction.
• NAHC: neural attentive framework for hour-level crime
prediction to address the challenge at day level. The
framework integrates Gated Recurrent Units (GRUs)
with a temporal attention mechanism in order to cap-
ture both short-term and long-term temporal relation-
ships, while also considering time-sensitive external
factors [63].
• DNN with feature level data fusion: crime occurrence
prediction model incorporates environmental context
information through the fusion of multi-modal data [64].
• CrimeTelescope: a platform for online crime prediction
and visualization that utilizes the fusion of urban and
social media data [65].
• ANN+BERT: BERT base approach to detect the crime
related twitter post [66].
• BERT base Model: A crime detection model base on
crime related posts from twitter [67].
B. RESULT AND DISCUSSION
The test accuracy results of our model and other methods for
crime prediction are presented in Table 3. Upon analysing
the table, we observe that sentiment-based crime prediction
models, such as sentiment-based SVM and sentiment-based
logistic regression, outperform SVM and logistic regression
models that do not consider sentiment data. This indicates that
incorporating tweet sentiment into crime prediction models
significantly enhances their performance compared to tradi-
tional models that do not consider tweet sentiment. Therefore,
it can be concluded that tweet sentiment has a noticeable
impact on the outcome of crime prediction.
Furthermore, our multimodal data fusion approach for
crime prediction yielded the highest result, showcasing an
improvement over sentiment-based logistic regression and
over sentiment-based SVM. There are two reasons why our
model achieved such results. Firstly, both sentiment-based
SVM and sentiment-based logistic regression models solely
consider the sentiment polarity and directly add sentiment
features to the crime data. However, these features do not
convey the same sentiment-driven information, limiting their
effectiveness.
In comparison to NAHC [63], a neural attentive model
introduced for hour-level crime prediction, our model
achieves a higher accuracy rate of 36.75%. NAHC uti-
lizes four datasets, including crime statistics from the police
department of Xiaogan (China), crime statistics from the
police department of NYC, POI data, and meteorological
data. However, its accuracy is only 61%. This discrepancy
can be attributed to NAHC’s lack of consideration for tweet
data and its utilization of multi-graph convolution instead of
a data fusion approach.
In comparison to DNN with feature level fusion model [64]
which presents a well-designed data fusion approach, where
multiple datasets are fused at the feature level. The model
combines crime temporal, environmental (image), and spa-
tial (demographics) features. Lower accuracy highlights the
importance of tweet data in crime prediction, which the DNN
with feature level fusion model fails to consider. Additionally,
the DNN model suffers from imbalanced data due to the
overwhelming lack of crime occurrence reports across all
sampling points of the environmental feature.
In comparison to CrimeTelescope [65] which is an online
platform for crime prediction and visualization that combines
features from various sources, such as crime temporal data,
tweets, and points of interest (POI) in urban areas. While the
model’s data fusion design is commendable, the discrepancy
in accuracy can be attributed to the fact that CrimeTelescope
employs Latent Dirichlet Allocation (LDA) for tweet feature
extraction, whereas our model utilizes Word2Vec.
VOLUME 11, 2023
93211

--- Page 9 ---

S. Tam, Ö. Ö. TanriÖver: Multimodal Deep Learning Crime Prediction Using Tweets
TABLE 3. Result comparison of crime prediction model with other approaches.
When compared to the ANN+BERT model [66], which
employs a BERT-based approach to detect crime using tweets
and weather data, we achieved an higher accuracy rate.
Although the ANN + BERT model utilizes tweets for crime
prediction, it employs a direct concatenation method on the
data source, which can lead to issues such as overfitting,
redundancy, and dependency on multiple datasets.
Our model surpasses the BERT-based model in crime
detection, which utilizes crime-related posts from Twitter.
This finding aligns with the approach employed in the ANN
+ BERT model described in [67], where a direct concatena-
tion method is implemented.
Therefore, our ConvBiLSTM model, which incorporates
multimodal data fusion, demonstrates superior performance
compared to other models, including SVM, Logistic Regres-
sion, NAHC, DNN with feature-level data fusion, CrimeTele-
scope, ANN+BERT, and BERT-based crime prediction mod-
els. By utilizing ConvBiLSTM, the network benefits from
both forward and backward LSTM hidden layers, enabling
a more comprehensive context understanding for the output
layer. As a result, our multimodal data fusion approach, uti-
lizing tweet data and ConvBiLSTM, outperforms traditional
deep-learning and BERT models
VI. CONCLUSION
Crime prevention relies on crime prediction as a crucial
method to determine the most effective patrol strategy for
law enforcement agencies. A number of crime prediction
approaches and solutions have been developed however they
neglect the present of tweets data source. Especially, with the
significant of data fusion techniques, the data from different
sources can be extracted and fuse into a single representation
that captures the information from all modalities. We intro-
duce a novel multimodal deep learning modal for crime
prediction, which can nicely combine the information of
tweets and crime incident data. The proposed multimodal
deep learning relies on the combination architecture of CNN
and BiLSTM, called ConvBiLSTM. We modified the struc-
ture of ConvBiLSTM; pre-train crime modal and tweet model
independently and parallel, summarize the meaning of both
modals through convolution and pooling layer, construct a
single representation of deep crime-semantic model by fusing
the vector feature to capture the information from both crime
and tweets data and train them to predict the crime.
Our approach features a novel ranking model that aligned
parts of language modalities through a common, multimodal
embedding. We showed that this model provides state of the
93212
VOLUME 11, 2023

--- Page 10 ---

S. Tam, Ö. Ö. TanriÖver: Multimodal Deep Learning Crime Prediction Using Tweets
art performance on crime prediction using tweets. Second,
we described a Multimodal ConvBiLSTM that can fuse data
from crime modal and tweet modal. We evaluated its perfor-
mance against other baseline models.
To evaluate the performance of our multimodal deep
learning for crime prediction, we employed some existing
methods for crime prediction comparison and benchmarked
with latest crime prediction models, including SVM, Logis-
tic Regression, NAHC, DNN with feature-level data fusion,
CrimeTelescope, ANN+BERT, and BERT-based crime pre-
diction models. The experimental result showed that our
model demonstrates superior performance compared to other
traditional deep-learning and BERT models with an accuracy
of 97.75%.
The analysis in this study was limited to tweets written in
English and related to theft crime and its similar crime such
as battery, burglary, robbery, and motor vehicle theft. Future
studies can expand the analysis into different languages and
different crime types. Furthermore, the study is conducted for
only one month of window time on database, an expansion of
window time could help verifying the result of the analysis.
In addition, the findings of this study are limited to only users
on Twitter platform; future research can explore text content
from other social platform to compare the results. Future
research may also look at various algorithms including using
supervised and unsupervised learning as method and see if
the outcomes vary from this study.
REFERENCES
[1] S. Sathyadevan, M. S. Devan, and S. S. Gangadharan, ‘‘Crime analysis and
prediction using data mining,’’ in Proc. 1st Int. Conf. Netw. Soft Comput.
(ICNSC), Aug. 2014, pp. 406–412, doi: 10.1109/CNSC.2014.6906719.
[2] B. Liu, Sentiment Analysis: Mining Opinions, Sentiments, and Emotions.
Cambridge, U.K.: Cambridge Univ. Press, 2015.
[3] B. Liu, ‘‘Sentiment analysis and opinion mining,’’ Synth. Lectures
Hum. Lang. Technol., vol. 5, no. 1, pp. 1–167, May 2012, doi:
10.2200/S00416ED1V01Y201204HLT016.
[4] B. Pang and L. Lee, ‘‘A sentimental education: Sentiment analysis using
subjectivity summarization based on minimum cuts,’’ in Proc. 42nd Annu.
Meeting Assoc. Comput. Linguistics, 2004, pp. 271–278.
[5] P. D. Turney, ‘‘Thumbs up or thumbs down? Semantic orientation applied
to unsupervised classification of reviews,’’ in Proc. 40th Annu. Meeting
Assoc. Comput. Linguistics, 2001, pp. 417–424.
[6] Bankmycell. (May 2023). How Many Users Does Twitter Have?
Accessed: May 20, 2023. [Online]. Available: https://www.bankmycell.
com/blog/how-many-users-does-twitter-have
[7] S. Alami and O. Elbeqqali, ‘‘Cybercrime profiling: Text mining techniques
to detect and predict criminal activities in microblog posts,’’ in Proc. 10th
Int. Conf. Intell. Syst., Theories Appl. (SITA), Oct. 2015, pp. 1–5.
[8] B. Liu, ‘‘Sentiment Analysis: Mining opinions, sentiments, and emotions,’’
Comput. Linguistics, vol. 42, no. 3, pp. 1–4, 2016.
[9] D. Lahat, T. Adali, and C. Jutten, ‘‘Multimodal data fusion: An overview
of methods, challenges, and prospects,’’ Proc. IEEE, vol. 103, no. 9,
pp. 1449–1477, Sep. 2015, doi: 10.1109/JPROC.2015.2460697.
[10] M. S. Gerber, ‘‘Predicting crime using Twitter and kernel density estima-
tion,’’ Decis. Support Syst., vol. 61, pp. 115–125, May 2014.
[11] D. L. Hall and J. Llinas ‘‘An introduction to multisensor data fusion,’’ Proc.
IEEE, vol. 85, no. 1, pp. 6–23, Jan. 1997.
[12] H. F. Durrant-Whyte, ‘‘Sensor models and multisensor integration,’’ Int. J.
Robot. Res., vol. 7, no. 6, pp. 97–113, Dec. 1988.
[13] F. Castanedo, ‘‘A review of data fusion techniques,’’ Sci. World J.,
vol. 2013, pp. 1–19, Sep. 2013.
[14] S. Tam, R. B. Said, and Ö. Ö. Tanriöver, ‘‘A ConvBiLSTM deep learning
model-based approach for Twitter sentiment classification,’’ IEEE Access,
vol. 9, pp. 41283–41293, 2021, doi: 10.1109/ACCESS.2021.3064830.
[15] H. Mcgurk and J. Macdonald, ‘‘Hearing lips and seeing voices,’’ Nature,
vol. 264, no. 5588, pp. 746–748, Dec. 1976.
[16] B. P. Yuhas, M. H. Goldstein, and T. J. Sejnowski, ‘‘Integration of acoustic
and visual speech signals using neural networks,’’ IEEE Commun. Mag.,
vol. 27, no. 11, pp. 65–71, Nov. 1989.
[17] H. Bourlard and S. Dupont, ‘‘A new ASR approach based on independent
processing and recombination of partial frequency bands,’’ in Proc. 4th Int.
Conf. Spoken Lang. Process. (ICSLP), Oct. 1996, p. 426.
[18] M. Brand, N. Oliver, and A. Pentland, ‘‘Coupled hidden Markov models for
complex action recognition,’’ in Proc. IEEE Comput. Soc. Conf. Comput.
Vis. Pattern Recognit., Jun. 1997, pp. 994–999.
[19] C. G. M. Snoek and M. Worring, ‘‘Multimodal video indexing: A review
of the state-of-the-art,’’ Multimedia Tools Appl., vol. 25, no. 1, pp. 5–35,
2005.
[20] S. K. D’mello and J. Kory, ‘‘A review and meta-analysis of multimodal
affect detection systems,’’ ACM Comput. Surv., vol. 47, no. 3, pp. 1–36,
Apr. 2015.
[21] T. Baltrusaitis, C. Ahuja, and L.-P. Morency, ‘‘Multimodal machine learn-
ing: A survey and taxonomy,’’ IEEE Trans. Pattern Anal. Mach. Intell.,
vol. 41, no. 2, pp. 423–443, Feb. 2019.
[22] J. Cheng, Y. Dai, Y. Yuan, and H. Zhu, ‘‘A simple analysis of multimodal
data fusion,’’ in Proc. IEEE 19th Int. Conf. Trust, Secur. Privacy Comput.
Commun. (TrustCom), Dec. 2020, pp. 1472–1475, doi: 10.1109/Trust-
Com50675.2020.00199.
[23] C. Shao, H. Li, and L. Ma, ‘‘Visual cognitive mechanism guided video
shot segmentation,’’ in Cognitive Computing—ICCC, R. Xu, J. Wang, and
L.-J. Zhang, Eds. Cham, Switzerland: Springer, 2019, pp. 186–196.
[24] J.
Donahue,
L.
A.
Hendricks,
M.
Rohrbach,
S.
Venugopalan,
S. Guadarrama, K. Saenko, and T. Darrell, ‘‘Long-term recurrent
convolutional networks for visual recognition and description,’’ IEEE
Trans. Pattern Anal. Mach. Intell., vol. 39, no. 4, pp. 677–691, Apr. 2017.
[25] X.-Y. Wu, C.-N. Gu, and S.-J. Wang, ‘‘Special video classification based
on multitask learning and multimodal feature fusion,’’ Opt. Precis. Eng.,
vol. 2020, vol. 28, no. 5, pp. 1177–1186.
[26] Y. Dai, G. Wang, and K.-C. Li, ‘‘Conceptual alignment deep neural net-
works,’’ J. Intell. Fuzzy Syst., vol. 34, no. 3, pp. 1631–1642, Mar. 2018.
[27] Y. Dai, G. Wang, J. Dai, and O. Geman, ‘‘A multimodal deep architecture
for traditional Chinese medicine diagnosis,’’ Concurrency Comput., Pract.
Exper., vol. 32, no. 19, p. e5781, Oct. 2020, doi: 10.1002/cpe.5781.
[28] E. Shutova, D. Kiela, and J. Maillard, ‘‘Black holes and white
rabbits: Metaphor identification with visual features,’’ in Proc. Conf.
North
Amer.
Chapter
Assoc.
Comput.
Linguistics,
Human
Lang.
Technol., 2016, pp. 160–170. [Online]. Available: https://www.aclweb.
org/anthology/N16-1020
[29] G.
Evangelopoulos,
A.
Zlatintsi,
A.
Potamianos,
P.
Maragos,
K. Rapantzikos, G. Skoumas, and Y. Avrithis, ‘‘Multimodal saliency
and fusion for movie summarization based on aural, visual, and textual
attention,’’ IEEE Trans. Multimedia, vol. 15, no. 7, pp. 1553–1568,
Nov. 2013.
[30] E. Morvant, A. Habrard, and S. Ayache, ‘‘Majority vote of diverse
classifiers for late fusion,’’ in Structural, Syntactic, and Statisti-
cal Pattern Recognition. Joensuu, Finland, 2014, pp. 153–162, doi:
10.48550/arXiv.1404.7796.
[31] X. Wang, M. S. Gerber, and D. E. Brown, ‘‘Automatic crime predic-
tion using events extracted from Twitter posts,’’ in Social Computing,
Behavioral-Cultural Modeling and Prediction. Berlin, Germany: Springer,
2012, pp. 231–238.
[32] X. Chen, Y. Cho, and S. Y. Jang, ‘‘Crime prediction using Twitter sentiment
and weather,’’ in Proc. Syst. Inf. Eng. Design Symp., Apr. 2015, pp. 63–68.
[33] T. Brandt, J. Bendler, and D. Neumann, ‘‘Social media analytics and value
creation in urban smart tourism ecosystems,’’ Inf. Manag., vol. 54, no. 6,
pp. 703–713, Sep. 2017.
[34] N. Malleson and M. A. Andresen, ‘‘The impact of using social media data
in crime rate calculations: Shifting hot spots and changing spatial patterns,’’
Cartography Geographic Inf. Sci., vol. 42, no. 2, pp. 112–121, Mar. 2015.
[35] N. Zainuddin, A. Selamat, and R. Ibrahim, ‘‘Improving Twitter Aspect-
Based sentiment analysis using hybrid approach,’’ in Intelligent Infor-
mation and Database Systems, vol. 9621, N. T. Nguyen, B. Trawinski,
H. Fujita, and T.-P. Hong, Eds. Berlin, Germany: Springer, 2016,
pp. 151–160.
VOLUME 11, 2023
93213

--- Page 11 ---

S. Tam, Ö. Ö. TanriÖver: Multimodal Deep Learning Crime Prediction Using Tweets
[36] B. Pang, L. Lee, and S. Vaithyanathan, ‘‘Thumbs up? Sentiment classifi-
cation using machine learning techniques,’’ in Proc. ACL Conf. Empirical
Methods Natural Lang. Process., 2002, pp. 79–86.
[37] F. Y. Zhou, L. P. Jin, and J. Dong, ‘‘Review of convolutional neural
network,’’ Chin. J. Comput., vol. 1, pp. 35–38, Oct. 2017.
[38] Y. Li and H. B. Dong, ‘‘Text emotion analysis based on CNN and BiLSTM
network feature fusion,’’ Comput. Appl., vol. 38, no. 11, pp. 29–34, 2018.
[39] N. Kalchbrenner and P. Blunsom, ‘‘Recurrent convolutional neural net-
works for discourse compositionality,’’ Comput. Sci., vol. 10, pp. 1–2,
Aug. 2013.
[40] K. Kim, B.-S. Chung, Y. Choi, S. Lee, J.-Y. Jung, and J. Park, ‘‘Language
independent semantic kernels for short-text classification,’’ Exp. Syst.
Appl., vol. 41, no. 2, pp. 735–743, Feb. 2014.
[41] D.-G. Zhang, S. Liu, T. Zhang, and Z. Liang, ‘‘Novel unequal clustering
routing protocol considering energy balancing based on network partition
& distance for mobile education,’’ J. Netw. Comput. Appl., vol. 88, pp. 1–9,
Jun. 2017.
[42] D.-G. Zhang, S. Zhou, and Y.-M. Tang, ‘‘A low duty cycle efficient MAC
protocol based on self-adaption and predictive strategy,’’ Mobile Netw.
Appl., vol. 23, no. 4, pp. 828–839, Aug. 2018.
[43] C. Jin and W. Li, ‘‘Chinese word segmentation based on bidirectional
LSTM neural network model,’’ Chin. J. Inf., vol. 32, no. 2, pp. 29–37, 2018.
[44] J. Chen, H. F. Li, and L. Ma, ‘‘Dimensional speech emotion recognition
method based on multi-granularity feature fusion,’’ Signal Process, vol.
33, no. 3, pp. 374–382, 2017.
[45] D.-G. Zhang, H.-L. Niu, and S. Liu, ‘‘Novel PEECR-based clustering rout-
ing approach,’’ Soft Comput., vol. 21, no. 24, pp. 7313–7323, Dec. 2017.
[46] D.-G. Zhang, Y.-M. Tang, Y.-Y. Cui, J.-X. Gao, X.-H. Liu, and T. Zhang,
‘‘Novel reliable routing method for engineering of Internet of Vehicles
based on graph theory,’’ Eng. Comput., vol. 36, no. 1, pp. 226–247,
Dec. 2018.
[47] Y. X. Fan, J. F. Guo, and Y. Y. Lan, ‘‘Context-based deep semantic sentence
retrieval model,’’ Chin. J. Inform. Sci., vol. 31, no. 5, pp. 161–167, 2017.
[48] K. Simonyan and A. Zisserman, ‘‘Two-stream convolutional networks for
action recognition in videos,’’ in Proc. 27th Int. Conf. Neural Inf. Process.
Syst. (NIPS), vol. 1, Dec. 2024, pp. 568–576.
[49] F. Chollet, Deep Learning with Python. Shelter, Island: Manning, 2017.
[50] A. Yadav and D. K. Vishwakarma, ‘‘Sentiment analysis using deep learn-
ing architectures: A review,’’ Artif. Intell. Rev., vol. 53, pp. 4335–4385,
Dec. 2019, doi: 10.1007/s10462-019-09794-5.
[51] W. Liu, ‘‘An attention-based syntax-tree and tree-LSTM model for
sentence summarization,’’ Int. J. Performability Eng., vol. 13 no. 5,
pp. 775–782, 2017.
[52] X. Niu, Y. Hou, and P. Wang, ‘‘Bi-directional LSTM with quantum atten-
tion mechanism for sentence modelling,’’ in Proc. 24th Int. Conf. Neural
Inf. Process. Guangzhou, China: Springer, 2017, pp. 178–188.
[53] M. Schuster and K. K. Paliwal, ‘‘Bidirectional recurrent neural networks,’’
IEEE Trans. Signal Process., vol. 45, no. 11, pp. 2673–2681, Nov. 1997.
[54] E. Kalampokis, E. Tambouris, and K. Tarabanis, ‘‘Understanding the pre-
dictive power of social media,’’ Internet Res., vol. 23, no. 5, pp. 544–559,
Oct. 2013.
[55] A. Culotta and B. Huberman, ‘‘Towards detecting influenza epidemics
by analyzing Twitter messages,’’ in Proc. 1st Workshop Social Media
Analytics, Jul. 2010, pp. 115–122.
[56] F. Franch, ‘‘(Wisdom of the Crowds)2: 2010 U.K. election prediction with
social media,’’ J. Inf. Technol. Politics, vol. 10, no. 1, pp. 57–71, Jan. 2013.
[57] M. Velay and F. Daniel, ‘‘Using NLP on news headlines to predict index
trends,’’ 2018, arXiv:1806.09533.
[58] S. Asur and B. A. Huberman, ‘‘Predicting the future with social media,’’ in
Proc. IEEE/WIC/ACM Int. Conf. Web Intell. Intell. Agent Technol., vol. 1,
Aug. 2010, pp. 492–499.
[59] P. S. Earle, D. Bowden, and M. Guy, ‘‘Twitter earthquake detection:
Earthquake monitoring in a social world,’’ Ann. Geophys., vol. 54, no. 6,
pp. 708–715, Jan. 2012.
[60] H. Choi and H. Varian, ‘‘Predicting the present with Google trends,’’ Econ.
Rec., vol. 88, pp. 2–9, Jun. 2012.
[61] J. Bollen, H. Mao, and X. Zeng, ‘‘Twitter mood predicts the stock market,’’
J. Comput. Sci., vol. 2, no. 1, pp. 1–8, Mar. 2011.
[62] X. Wang, D. Brown, and M. Gerber, ‘‘Spatio-temporal modeling of
criminal incidents using geographic, demographic, and Twitter-derived
information,’’ in Proc. IEEE Int. Conf. Intell. Secur. Inform. (Lecture Notes
in Computer Science), 2012, pp. 36–41.
[63] W. Liang, Y. Wang, H. Tao, and J. Cao, ‘‘Towards hour-level crime pre-
diction: A neural attentive framework with spatial–temporal-categorical
fusion,’’ Neurocomputing, vol. 486, pp. 286–297, May 2022, doi:
10.1016/j.neucom.2021.11.052.
[64] H.-W. Kang and H.-B. Kang, ‘‘Prediction of crime occurrence from multi-
modal data using deep learning,’’ PLoS ONE, vol. 12, no. 4, Apr. 2017,
Art. no. e0176244, doi: 10.1371/journal.pone.0176244.
[65] D. Yang, T. Heaney, A. Tonon, L. Wang, and P. Cudré-Mauroux, ‘‘Crime-
Telescope: Crime hotspot prediction based on urban and social media data
fusion,’’ World Wide Web, vol. 21, no. 5, pp. 1323–1347, Sep. 2018, doi:
10.1007/s11280-017-0515-4.
[66] S. P. C. W. Sandagiri, B. T. G. S. Kumara, and B. Kuhaneswaran,
‘‘ANN based crime detection and prediction using Twitter posts and
weather data,’’ in Proc. Int. Conf. Data Analytics Bus. Ind., Way Towards
Sustain. Economy (ICDABI), Oct. 2020, pp. 1–5, doi: 10.1109/ICD-
ABI51230.2020.9325660.
[67] S. P. C. W. Sandagiri, B. T. G. S. Kumara, and B. Kuhaneswaran, ‘‘Deep
neural network-based approach to identify the crime related Twitter posts,’’
in Proc. Int. Conf. Decis. Aid Sci. Appl. (DASA), Sakheer, Bahrain,
Nov. 2020, pp. 1000–1004, doi: 10.1109/DASA51403.2020.9317098.
SAKIRIN TAM was born in Kompong Cham,
Cambodia, in 1985. He received the B.S. degree
in information technology from Fatoni University,
Pattani, Thailand, in 2010, and the M.S. degree
in information technology management from the
University of Technology Malaysia, Johor Bahru,
Malaysia, in 2014. From 2010 to 2015, he was a
Lecturer with the Information Technology Depart-
ment, Fatoni University. He is currently the Vice
Dean of the ICT Faculty, University of Puthisastra,
Cambodia. His current research interests include machine learning, deep
leaning, natural language processing, sentiment analysis, data mining, green
IT, and computer based test.
ÖMER ÖZGÜR TANRIÖVER received the B.Sc.
degree in computer engineering, the M.Sc. degree
in science and technology, and the Ph.D. degree
in information systems from Middle East Techni-
cal University, Ankara, Turkey. He was a Certi-
fied Information Systems Auditor (CISA) with the
Information Management Department, Banking
Regulation Agency. He is currently an Assistant
Professor with the Computer Engineering Depart-
ment, Ankara University. His current research
interests include software quality, information systems security, and machine
learning for prediction.
93214
VOLUME 11, 2023
