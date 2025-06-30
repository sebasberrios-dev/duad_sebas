from flask import Flask, request, jsonify
import json

app = Flask(__name__)
DATA_FILE = 'tasks.json'
VALID_STATUSES = ['Por Hacer', 'En Progreso', 'Completada']

def load_tasks():
    try:
        with open(DATA_FILE, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        print('Advertencia: Archivo de tareas no encontrado, se usará lista vacía.')
        return []
    except json.JSONDecodeError:
        print('Error: El archivo de tareas no tiene un formato JSON válido.')
        return []

def save_tasks(tasks):
    try:
        with open(DATA_FILE, 'w') as file:
            json.dump(tasks, file, indent=4)
    except Exception as e:
        print(f'Error al guardar las tareas: {e}')
        raise

def find_task_by_id(task_id, tasks_list):
    return next((task for task in tasks_list if task['id'] == task_id), None)

@app.route('/tasks', methods=['GET'])
def show_tasks():
    tasks_list = load_tasks()
    status_filter = request.args.get('status')
    if status_filter:
        if status_filter not in VALID_STATUSES:
            return jsonify(message='El valor del filtro status no es válido'), 400
        tasks_list = list(
            filter(lambda task: task['status'] == status_filter, tasks_list)
        )
    return {'tasks': tasks_list}, 200

@app.route('/tasks', methods=['POST'])
def create_task():
    try:
        tasks_list = load_tasks()

        if 'title' not in request.json:
            raise ValueError('El campo title es obligatorio')
        
        if 'description' not in request.json:
            raise ValueError('El campo description es obligatorio')
        
        if 'status' not in request.json:
            raise ValueError('El campo status es obligatorio')
        
        if request.json['status'] not in VALID_STATUSES:
            raise ValueError('El campo status debe ser Por Hacer, En Progreso o Completada')
        
        new_id = max([task['id'] for task in tasks_list], default=0) + 1

        tasks_list.append({
            'id': new_id,
            'title': request.json['title'],
            'description': request.json['description'],
            'status': request.json['status']
        })

        save_tasks(tasks_list)
    
    except ValueError as e:
        return jsonify(message=str(e)), 400
    except Exception as e:
        print(f"Error inesperado: {e}")
        return jsonify(message='Error al crear la tarea'), 500
    
    return jsonify(message='Tarea creada correctamente'), 201

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        tasks_list = load_tasks()
        task = find_task_by_id(task_id, tasks_list)
        if not task:
            return jsonify(message='Tarea no encontrada'), 404
        
        if 'title' in request.json:
            task['title'] = request.json['title']
        
        if 'description' in request.json:
            task['description'] = request.json['description']
        
        if 'status' in request.json:
            if request.json['status'] not in VALID_STATUSES:
                raise ValueError('El campo status debe ser Por Hacer, En Progreso o Completada')
            task['status'] = request.json['status']
        
        save_tasks(tasks_list)
    
    except ValueError as e:
        return jsonify(message=str(e)), 400
    except Exception as e:
        print(f"Error inesperado: {e}")
        return jsonify(message='Error al actualizar la tarea'), 500
    
    return jsonify(message='Tarea actualizada correctamente'), 200

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        tasks_list = load_tasks()
        task = find_task_by_id(task_id, tasks_list)
        if not task:
            return jsonify(message='Tarea no encontrada'), 404
        
        tasks_list.remove(task)
        save_tasks(tasks_list)
    
    except Exception as e:
        print(f"Error inesperado: {e}")
        return jsonify(message='Error al eliminar la tarea'), 500
    
    return jsonify(message='Tarea eliminada correctamente'), 200

if __name__ == '__main__':
    app.run(host='localhost', debug=True)

