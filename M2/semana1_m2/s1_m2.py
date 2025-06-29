from flask import Flask, request, jsonify
import json

app = Flask(__name__)
DATA_FILE = 'tasks.json'


def load_tasks():
    try:
        with open(DATA_FILE, 'r') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def save_tasks(tasks):
    with open(DATA_FILE, 'w') as file:
        json.dump(tasks, file, indent=4)



@app.route('/tasks', methods=['GET'])
def show_tasks():
    tasks_list = load_tasks()
    status_filter = request.args.get('status')
    if status_filter:
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
        
        if request.json['status'] not in ['Por Hacer', 'En Progreso', 'Completada']:
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
        task = next((task for task in tasks_list if task['id'] == task_id), None)
        if not task:
            return jsonify(message='Tarea no encontrada'), 404
        
        if 'title' in request.json:
            task['title'] = request.json['title']
        
        if 'description' in request.json:
            task['description'] = request.json['description']
        
        if 'status' in request.json:
            if request.json['status'] not in ['Por Hacer', 'En Progreso', 'Completada']:
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
        task = next((task for task in tasks_list if task['id'] == task_id), None)
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
