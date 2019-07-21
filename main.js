const ToDoList = (function() {
  class Task {
    constructor(taskInfo) {
      this.taskInfo = taskInfo
      this.htmlElement = null
      this.removeButton = null
    }

    init(removeTask, ToogleDoneTask) {
      this.htmlElement = document.createElement('div')
      this.htmlElement.innerText = this.taskInfo.text
      this.htmlElement.classList.add('task')
      this.htmlElement.addEventListener('click', ToogleDoneTask)
      this.taskInfo.done && this.htmlElement.classList.add('task--done')

      this.removeButton = document.createElement('div')
      this.removeButton.innerText = 'Remove'
      this.removeButton.addEventListener('click', removeTask)
      this.removeButton.classList.add('task__remove-button')

      this.htmlElement.appendChild(this.removeButton)

      return this
    }

    append() {
      document.body.appendChild(this.htmlElement)
    }
  }

  class ToDoList {
    constructor(container) {
      this.container = container || document.body
      this.filterText = ''
      this.show = 'all'

      this.tasks = JSON.parse(localStorage.getItem('tasks')) || []
      this.tasksBox = null
    }

    newElement(element) {
      return document.createElement(element)
    }

    append(element, container, cssClass) {
      element.classList.add(cssClass)
      container.appendChild(element)
    }

    addTask(text) {
      if (text) {
        const task = {
          text: text,
          done: false
        }
        this.tasks.push(task)
      }
      this.saveStatus()
    }

    init() {
      const mainBox = this.newElement('div')
      this.append(mainBox, this.container, 'main-box')

      const formBox = this.newElement('div')
      this.append(formBox, mainBox, 'form-box')

      const addForm = this.newElement('form')
      addForm.addEventListener('submit', evt => {
        evt.preventDefault()
        this.addTask(addFormTextInput.value)
        addFormTextInput.value = ''
      })
      this.append(addForm, formBox, 'add-form')

      const addFormTextInput = this.newElement('input')
      addFormTextInput.placeholder = 'Add task text here'
      this.append(addFormTextInput, addForm, 'add-form__text-input')

      const addFormSubmitButton = this.newElement('button')
      addFormSubmitButton.innerText = 'Add'
      this.append(addFormSubmitButton, addForm, 'add-form__submit-button')

      const filterForm = this.newElement('form')
      filterForm.addEventListener('submit', evt => {
        evt.preventDefault()
        this.filterText = filterFormTextInput.value.toLowerCase()
        filterFormTextInput.value = ''
        this.render()
      })
      this.append(filterForm, formBox, 'filter-form')

      const filterFormTextInput = this.newElement('input')
      filterFormTextInput.placeholder = 'Type text to filter'
      this.append(filterFormTextInput, filterForm, 'filter-form__text-input')

      const filterFormSubmitButton = this.newElement('button')
      filterFormSubmitButton.innerText = 'Filter'
      this.append(
        filterFormSubmitButton,
        filterForm,
        'filter-form__submit-button'
      )

      const showAll = this.newElement('div')
      showAll.innerText = 'All'
      showAll.classList.add('show--active')
      showAll.addEventListener('click', evt => {
        this.changeShow(evt)
      })
      this.append(showAll, formBox, 'show')

      const showPending = this.newElement('div')
      showPending.innerText = 'Pending'
      showPending.addEventListener('click', evt => {
        this.changeShow(evt)
      })
      this.append(showPending, formBox, 'show')

      const showDone = this.newElement('div')
      showDone.innerText = 'Done'
      showDone.addEventListener('click', evt => {
        this.changeShow(evt)
      })
      this.append(showDone, formBox, 'show')

      this.tasksBox = this.newElement('div')
      this.append(this.tasksBox, mainBox, 'tasks-box')

      return this
    }

    changeShow(evt) {
      document.querySelector('.show--active') &&
        document.querySelector('.show--active').classList.remove('show--active')
      evt.target.classList.add('show--active')

      this.show = evt.target.innerText.toLowerCase()
      this.render()
    }

    saveStatus() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
      this.render()
    }

    textIfFiltered() {
      if (this.filterText) {
        const filterMessage = this.newElement('p')
        filterMessage.innerText = `Results for: '${this.filterText}' `
        this.append(filterMessage, this.tasksBox, 'filter-message')

        const removeFilter = this.newElement('span')
        removeFilter.innerText = '(delete filters)'
        removeFilter.addEventListener('click', () => {
          this.filterText = ''
          this.render()
        })
        this.append(removeFilter, filterMessage, 'remove-filter')
      }
    }

    handleRemoveTask(index) {
      return () => {
        this.tasks = this.tasks.filter((el, i) => index !== i)
        this.saveStatus()
      }
    }

    handleToogleDoneTask(element) {
      return () => {
        element.done = element.done ? false : true
        this.saveStatus()
      }
    }

    render() {
      this.tasksBox.innerText = ''

      this.textIfFiltered()

      let tasksToShow = this.tasks
      if (this.show === 'pending' || this.show === 'done') {
        tasksToShow = tasksToShow.filter(el =>
          this.show === 'pending' ? !el.done : el.done
        )
      }

      const filteredTasks = tasksToShow.filter(el =>
        el.text.toLowerCase().includes(this.filterText)
      )

      filteredTasks.forEach((element, index) => {
        const task = new Task(element)
        task.init(
          this.handleRemoveTask(index),
          this.handleToogleDoneTask(element)
        )

        this.tasksBox.appendChild(task.htmlElement)
      })
    }
  }

  return ToDoList
})()

const toDoList = new ToDoList()
toDoList.init().render()
