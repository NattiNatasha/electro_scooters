'use strict'

const slides = document.querySelector('.slider').children
const circleIndicators = document.querySelector('.circle-indicators')
const modalWindow = document.querySelector('.modal-window')
const overlay = document.querySelector('.overlay')
const btnCloseModalWindow = document.querySelector('#close-modal-window')
const btnShowModalWindow = document.querySelectorAll('.show-modal-window')
const form = document.querySelector('#form')
let navbar = document.querySelector('.navbar')

let index = 0

// Working with mobile menu

document.querySelector('#menu-btn').onclick = () => {
  navbar.classList.toggle('active')
}

window.onscroll = () => {
  navbar.classList.remove('active')
}

// Working with sending form

form.addEventListener('submit', sendForm)

async function sendForm(e) {
  e.preventDefault()

  let error = validateForm(form)

  let formData = new FormData(form)

  if (error === 0) {
    form.classList.add('_sending')
    let response = await fetch('sendmail.php', {
      method: 'POST',
      body: formData,
    })
    if (response.ok) {
      let result = await response.json()
      alert(result.message)
      formPreview.innerHTML = ''
      form.reset()
      form.classList.remove('_sending')
    } else {
      alert('Ошибка!')
      form.classList.remove('_sending')
    }
  } else {
    alert('Необходимо заполнить обязательные поля')
  }
}

function validateForm(form) {
  let error = 0
  let formReq = document.querySelectorAll('._req')

  for (let i = 0; i < formReq.length; i++) {
    let input = formReq[i]
    removeError(input)

    if (input.value === '') {
      addError(input)
      error++
    } else if (
      input.getAttribute('type') === 'checkbox' &&
      input.checked === false
    ) {
      addError(input)
      error++
    }
  }
  return error
}

function addError(input) {
  input.parentElement.classList.add('_error')
  input.classList.add('_error')
}

function removeError(input) {
  console.log(input)
  input.parentElement.classList.remove('_error')
  input.classList.remove('_error')
}

// Working with slides

function createCircleIndicators() {
  for (let i = 0; i < slides.length; i++) {
    const div = document.createElement('div')
    div.setAttribute('onclick', 'indicateSlide(this)')
    div.id = i
    if (i == 0) {
      div.className = 'active'
    }
    circleIndicators.appendChild(div)
  }
}
createCircleIndicators()

function indicateSlide(el) {
  console.log(el.id)
  index = el.id
  changeSlide()
  updateCircleIndicator()
  resetTimer()
}

function updateCircleIndicator() {
  for (let i = 0; i < circleIndicators.children.length; i++) {
    circleIndicators.children[i].classList.remove('active')
  }
  circleIndicators.children[index].classList.add('active')
}

function prevSlide() {
  if (index == 0) {
    index = slides.length - 1
  } else {
    index--
  }
  changeSlide()
}

function nextSlide() {
  if (index == slides.length - 1) {
    index = 0
  } else {
    index++
  }
  changeSlide()
}

function changeSlide() {
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove('active')
  }
  slides[index].classList.add('active')
}

function resetTimer() {
  clearInterval(timer)
  timer = setInterval(autoPlay, 4000)
}

function autoPlay() {
  nextSlide()
  updateCircleIndicator()
}

let timer = setInterval(autoPlay, 4000)

// Working with modal window

const closeModalWindow = function () {
  modalWindow.classList.add('hidden')
  overlay.classList.add('hidden')
}

const showModalWindow = function () {
  modalWindow.classList.remove('hidden')
  overlay.classList.remove('hidden')
}

for (let i = 0; i < btnShowModalWindow.length; i++) {
  btnShowModalWindow[i].addEventListener('click', showModalWindow)
}

btnCloseModalWindow.addEventListener('click', closeModalWindow)
overlay.addEventListener('click', closeModalWindow)

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindow()
  }
})
