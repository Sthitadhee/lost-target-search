def create_path(matrix, src, visited, path, paths):
    # 4
    visited[src] = True
    path.append(src) #[0, 1, 4]
    
    if not element_left(src, matrix):
        # print(path)
        paths.append(path[:])
    else:
        for i in range(len(matrix)): # 0 1 2 3 4 5 [0 -> 1 -> 4 ->]
            # print(src, i)
            if not visited[i] and matrix[src][i]:
                create_path(matrix, i, visited, path, paths)
        

    path.pop()
    visited[src]= False


def create_path_main(matrix, time_constraint=3):
    visited = [False] * len(matrix)
    path = []
    paths = []
    create_path(matrix, 0, visited, path, paths)
    print('test paths drawn --->', paths)
    for path in paths:
        return_paths = []
        path_length = 0
        for j in range(len(path)-1):
            first_index = path[j]
            second_index = path[j+1]
            return_paths.append([first_index, second_index])
            path_length += matrix[first_index][second_index]
            if path_length > time_constraint:
                print('Path length when time contrainst violated ---> ', path_length)
                return return_paths, True
    return return_paths, False


def element_left(src, matrix):
    for i in range(len(matrix)):
        # print(matrix[src][i], src, i)
        if matrix[src][i]:
            return True
    return False

 
# Driver's code
if __name__ == '__main__':
    graph = [
               [0, 1, 2, 0, 0, 0], #1 -> 2 -> 5 -> 6
               [0, 0, 10, 0, 2, 0], #1 -> 3
               [0, 0, 0, 0, 0, 0], # 2 -> 3
               [0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 0, 0],
            ]
 
    print(create_path_main(graph, 2))
 
    # 0 -> 1 (1) 
    # 1 -> 0 (1) 