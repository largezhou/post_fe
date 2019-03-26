import MdiIcon from './MdiIcon'
import Vue from 'vue'

const components = {
  MdiIcon,
}

Object.keys(components).forEach((c) => Vue.component(c, components[c]))
