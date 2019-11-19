import {apply, html} from 'https://cdn.pika.dev/apply-html/^2.0.1';

function MethodsList(onMethodSelected){
  let methodsList = document.getElementById('methods-list')  
  
  const MethodListItem = ({name, internal}) => html`
    <p class="flex items-center">
      <a href="#/${name}" class="fw5 method dim f6 ${internal ? 'black-60' : 'green'}">${name}</a>
    </p>
  `
  
  function view(methods = []){
    let internal = methods.filter(m => m.internal)
    let userland = methods.filter(m => !m.internal)
    
    return html`
      <div class="mb4">
        <p class="f6 black-60">Internal</p>
        ${internal.map(MethodListItem)}
      </div>
      
      <div>
        <p class="f6 black-60">User-provided</p>
        ${userland.map(MethodListItem)}
      </div>
    `
  }
  
  // Bind events
  methodsList.addEventListener('click', (evt) => {
    if(evt.target.matches('a.method')){
      onMethodSelected(evt.target.textContent)
    }
  }, false)
  
  function update(methods = []){
    apply(methodsList, view(methods))
  }
  
  return {update, onMethodSelected}

}

function mainSection(){
  let el = document.getElementById('main')
  
  function render({methodName, internal, args = []}){
    return html`
      <h1 class="f4 fw6"><span class="bb bw1 b--dark-green">${methodName}</span></h1>
    `
  }
  
  function update({methodName, internal}){
    apply(el, render(...arguments))
  }
  
  return {update}
}

let methods = []
let main = mainSection()

let methodList = MethodsList((methodName) => {
  let method = methods.find(m => m.name === methodName)
  main.update({methodName: method.name, internal: method.internal})
})


setTimeout(_ => {
  methods = [
    {name: "getUser", internal: false}
    , {name: "createUser", internal: false}
    , {name: "endpoints", internal: true}
  ]
  
  methodList.update(methods)
}, 500) 