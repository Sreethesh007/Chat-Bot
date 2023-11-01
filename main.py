from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
import string
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from nltk.stem import WordNetLemmatizer
import spacy
import chatterbot.logic 
from chatterbot.conversation import Statement
from chatterbot.trainers import ListTrainer
from chatterbot.logic import LogicAdapter

#  Create a new chat bot

bot = ChatBot('AI')

# Specifying database

bot = ChatBot(
    'AI',
    # storage_adapter='chatterbot.storage.SQLStorageAdapter',
)

# Specifying logical and storage adapters

bot = ChatBot(
    'AI', 
    storage_adapter='chatterbot.storage.MongoDatabaseAdapter',
    preprocessors=[
        'chatterbot.preprocessors.clean_whitespace'
    ],
    logic_adapters=[
        {
            'import_path': 'chatterbot.logic.BestMatch',
            'default_response': 'I am sorry, but I do not understand and I am still learning.',
            'maximum_similarity_threshold': 0.90
        },

    ],
)
    
# Training the bot

trainer = ChatterBotCorpusTrainer(bot)

trainer.train(
    # "chatterbot.corpus.english",
)

def bot_response(query):
    # Check if the query contains mathematical operations
    math_operators = [ "+", "-", "*", "/"]
    for operator in math_operators:
        if operator in query:
            try:
                result = eval(query)
                response = f"The result is {result}"
            except ZeroDivisionError:
                response = "You can't divide by zero."
            except Exception as e:
                response = "An error occurred while performing the operation."
            break
    else:
        # Text normalization, tokenization, stopword removal
        query = query.lower()  # Normalize to lowercase
        query_tokens = word_tokenize(query)  # Tokenization
        stop_words = set(stopwords.words("english"))
        query_tokens = [word for word in query_tokens if word not in stop_words]  # Stopword removal

        # Feature extraction (BoW)
        feature_vector = {}
        for word in query_tokens:
            if word not in feature_vector:
                feature_vector[word] = 1
            else:
                feature_vector[word] += 1

        response = bot.get_response(query)  # Chatbot response
    return response