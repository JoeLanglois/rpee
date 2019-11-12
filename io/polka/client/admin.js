const {dom} = document
const {api} = window

const refs = {
  methodList: document.querySelector('#methods-list'),
  namePlaceHolder: document.querySelector('#methodName-placeholder')
}

const state = {
  endpoints: [],
  selectedEndpoint: null
}

function endpointsLink({name, internal, args = []}){
  let el = dom`<p><a class="${internal ? 'black-70': 'dark-green'} dim no-underline f6" href="#">${name}</a></p>`
  let link = el.querySelector('a')

  link.onclick = e => {
    e.preventDefault()
    state.selectedEndpoint = {name, args}
    window.location.hash = '#/' + name

    rerenderDebugger()
  }


  return el
}

function rerenderDebugger(){
  const {name, args} = state.selectedEndpoint
  let el = document.querySelector('#methodName-placeholder')
  el.replaceWith(dom`<h2 id="methodName-placeholder">${name}( ${args.join(', ')} )</h2>`)
}


api.getEndpoints().then(endpoints => {
  state.endpoints = endpoints

  if(window.location.hash !== ''){
    const hashMethodName = window.location.hash.split('#/')[1]
    const selected = state.endpoints.find(({name}) => name === hashMethodName)

    if(selected) {
      state.selectedEndpoint = selected
      rerenderDebugger()
    }
  }

  refs.methodList.append(...endpoints.map(endpointsLink))
})
