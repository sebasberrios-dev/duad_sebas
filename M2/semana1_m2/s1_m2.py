from flask import Flask, request, jsonify

app = Flask(__name__)

tasks_list = [
    {
    'id' : 1,
    'title': 'Lavar platos',
    'description': 'Lavar los platos de la cena',
    'status': 'Completada'
    },

]

@app.route('/show', methods=['GET'])
def show_tasks():
    filtered_tasks = tasks_list
    status_filter = request.args.get('status')
    if status_filter:
        filtered_tasks = list(
            filter(lambda task: task['status'] == status_filter, filtered_tasks)
        )
    return {'tasks': filtered_tasks}, 200

@app.route('/create', methods=['POST'])
def create_task():
    try:
        if 'id' in tasks_list:
            raise ValueError('El campo id ya existe')
        
        if 'title' not in request.json:
            raise ValueError('El campo title es obligatorio')
        
        if 'description' not in request.json:
            raise ValueError('El campo description es obligatorio')
        
        if 'status' not in request.json:
            raise ValueError('El campo status es obligatorio')
        
        if request.json['status'] not in ['Por Hacer', 'En Progreso', 'Completada']:
            raise ValueError('El campo status debe ser Por Hacer, En Progreso o Completada')
        
        tasks_list.append({
            'id': len(tasks_list) + 1,
            'title': request.json['title'],
            'description': request.json['description'],
            'status': request.json['status']
        })
    
    except ValueError as e:
        return jsonify(message=str(e)), 400
    except Exception as e:
        print(f"Error inesperado: {e}")
        return jsonify(message='Error al crear la tarea'), 500
    
    return jsonify(message='Tarea creada correctamente'), 200

@app.route('/update/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        task = next((task for task in tasks_list if task['id'] == task_id), None)
        if not task:
            return jsonify(message='Tarea no encontrada'), 400
        
        if 'title' in request.json:
            task['title'] = request.json['title']
        
        if 'description' in request.json:
            task['description'] = request.json['description']
        
        if 'status' in request.json:
            if request.json['status'] not in ['Por Hacer', 'En Progreso', 'Completada']:
                raise ValueError('El campo status debe ser Por Hacer, En Progreso o Completada')
            task['status'] = request.json['status']
    
    except ValueError as e:
        return jsonify(message=str(e)), 400
    except Exception as e:
        print(f"Error inesperado: {e}")
        return jsonify(message='Error al actualizar la tarea'), 500
    
    return jsonify(message='Tarea actualizada correctamente'), 200

@app.route('/delete/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        task = next((task for task in tasks_list if task['id'] == task_id), None)
        if not task:
            return jsonify(message='Tarea no encontrada'), 400
        
        tasks_list.remove(task)
    
    except Exception as e:
        print(f"Error inesperado: {e}")
        return jsonify(message='Error al eliminar la tarea'), 500
    
    return jsonify(message='Tarea eliminada correctamente'), 200

if __name__ == '__main__':
    app.run(host='localhost', debug=True)