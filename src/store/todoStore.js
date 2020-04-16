import { observable, computed, action } from 'mobx'

class TodosStore {
  id = 0;
  @observable todos = [];

  @computed get desc() {
    return `还有 ${this.todos.length} 项任务待完成。`
  }

  @action addTodo(value) {
    this.todos.push({
      id: this.id++,
      value
    })
  }
  @action deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
  @action resetTodo() {
    this.todos = [];
  }
}
const store = new TodosStore();

export default store;
