class Task {
  constructor(taskInfo) {
    this.taskInfo = taskInfo
    this.htmlElement = null
  }

  init() {
    this.htmlElement = document.createElement('div')
    this.htmlElement.innerText = this.taskInfo.text
    this.htmlElement.classList.add('task')
    this.taskInfo.done && this.htmlElement.classList.add('task--done')

    return this
  }

  append() {
    document.body.appendChild(this.htmlElement)
  }
}

class ToDoList {
  constructor(container) {
    this.container = container || document.body

    this.tasks = []
    this.tasksBox = null
    this.formTextInput = null
  }

  newElement(element) {
    return document.createElement(element)
  }

  append(element, container, cssClass) {
    element.classList.add(cssClass)
    container.appendChild(element)
  }

  addTask() {
    const task = {
      text: this.formTextInput.value,
      done: false
    }
    this.tasks.push(task)
    this.render()
  }

  init() {
    const mainBox = this.newElement('div')
    this.append(mainBox, this.container, 'main-box')

    const formBox = this.newElement('div')
    this.append(formBox, mainBox, 'form-box')

    const form = this.newElement('form')
    form.addEventListener('submit', evt => {
      evt.preventDefault()
      this.addTask()
      this.formTextInput.value = ''
    })
    this.append(form, formBox, 'form')

    this.formTextInput = this.newElement('input')
    this.formTextInput.placeholder = 'Add task text here'
    this.append(this.formTextInput, form, 'form__text-input')

    const submitButton = this.newElement('button')
    submitButton.innerText = 'Add'
    this.append(submitButton, form, 'form__submit-button')

    this.tasksBox = this.newElement('div')
    this.append(this.tasksBox, mainBox, 'tasks-box')
  }

  render() {
    this.tasksBox.innerText = ''
    this.tasks.forEach((element, index) => {
      const task = new Task(element)

      task.init()
      this.tasksBox.appendChild(task.htmlElement)
    })
  }
}

const toDoList = new ToDoList()
toDoList.init()

// const taskText = {
//   text: 'Some text',
//   done: false
// }

// const task = new Task(taskText)
// task.init().append()

// const task1 = new Task(taskText)
// task1.init().append()
