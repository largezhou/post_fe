import utils from '@/libs/utils'

const directive = (e, el, binding) => {
  if (!utils.clickedInEl(el, e.clientX, e.clientY)) {
    binding.value && binding.value(e)
  }
}

let onClick

export const ClickOutside = {
  inserted(el, binding) {
    onClick = (e) => {
      return directive(e, el, binding)
    }
    document.addEventListener('click', onClick, true)
  },
  unbind(el) {
    document.removeEventListener('click', onClick, true)
  },
}
