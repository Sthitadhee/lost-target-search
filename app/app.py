from flask import Flask, render_template, request
import numpy as np
from scipy.stats import multivariate_normal
import ast

# provide settings for flask to update the location to template_folder and statis_folder
app = Flask(__name__, template_folder='../web/templates', static_folder="../web/static")


# remove cache from jinja used in flask to see the changes during developement
def before_request():
    app.jinja_env.cache = {}

app.before_request(before_request)

# home route
@app.route("/")
def home():
    return render_template('index.html')

# visualise the first map route
@app.route("/result", methods=['POST'])
def createModel():
    # process the data to obtain as dict form
    data = ast.literal_eval(request.data.decode('utf8').replace("'", '"'))
    MAPSIZE_X, MAPSIZE_Y = data['data']['model']['MAPSIZE_X'], data['data']['model']['MAPSIZE_Y']
    mean, covariance = data['data']['target']['mean'], data['data']['target']['covariance']
    
    request_method_str = request.method
    if request_method_str == 'POST':
        # sample numbers 0 till 39 
        x, y = np.arange(0, MAPSIZE_X), np.arange(0, MAPSIZE_Y)

        # convert to matrix grid allowing for manipulation
        [X, Y] = np.meshgrid(x, y)

        # get column vectors of matrices
        X_vector, Y_vector = np.c_[X.flatten()], np.c_[Y.flatten()]
        # stack the columns side by side to form a matrix
        column_stack = np.concatenate((Y_vector, X_vector), axis=1)

        # get column vector of values from a normal distribution pdf
        pdf = multivariate_normal.pdf(column_stack, mean=mean, cov=covariance)

        # round it to 4 decimal places like matlab
        pdf_column = np.around(pdf, 4)

        # reshap back to matrix and then to list
        pdf_matrix = np.reshape(pdf_column, (MAPSIZE_X, MAPSIZE_Y))

        # sum all the matrix elements
        pdf_matrix_sum = pdf_matrix.sum(keepdims=1)

        # divide each element with sum to scale to 1
        pmap = np.ndarray.tolist(np.around(pdf_matrix/pdf_matrix_sum, 4))

        return str(pmap)