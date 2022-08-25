import numpy as np
import sys
from scipy.stats import multivariate_normal
import matplotlib.pyplot as plt
import random

random.seed(0)

np.set_printoptions(threshold=sys.maxsize)
# sample numbers 0 till 39 
x, y = np.arange(0,40), np.arange(0,40)

# convert to matrix grid allowing for manipulation
[X, Y] = np.meshgrid(x, y)

# get column vectors of matrices
X_vector, Y_vector = np.c_[X.flatten()], np.c_[Y.flatten()]
# stack the columns side by side to form a matrix
column_stack = np.concatenate((Y_vector, X_vector), axis=1)

# get column vector of values from a normal distribution pdf
pdf_column = np.around(multivariate_normal.pdf(column_stack, mean=[5,5], cov=[[2,0],[0,2]]), 4) 
# convert back to matrix
pmap = np.reshape(pdf_column, (40, 40))

pdf_matrix_sum = np.matrix.sum(np.matrix(pmap))
pmap = pmap/pdf_matrix_sum

print(pmap)

# plot to check
h = plt.figure(1)
plt.pcolor(pmap, cmap='cividis')
plt.show()