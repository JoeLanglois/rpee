import {apply, html, raw} from 'https://cdn.pika.dev/apply-html/^2.0.1';
const {api} = window

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

function mainSection({onSendRequest} = {}){
  let el = document.getElementById('main')
  let flask = new CodeFlask('#code-editor', { language: 'js'})

  let currentMethod = null
  let currentArgs = []

  function render({methodName = currentMethod, internal, args = currentArgs, results}){
    return html`
      <h1 class="f4 fw6 mb5"><span class="bb bw1 b--dark-green">${methodName}(${args.join(', ')})</span></h1>
      <p class="ttu fw6 f6 black-50">Console</p>
      ${raw(flask.editorRoot.outerHTML)}
      <button class="send-btn mb3 bw0 pa1 green underline bg-white pointer dim">Send!</button>

      <p class="ttu fw6 f6 black-50">Results</p>
      <div class="bg-black-80 w-100">
        <pre class="near-white f6 h5 overflow-y-scroll pa3">${JSON.stringify(results, null, 2)}</pre>
      </div>
    `
  }
  
  function update({methodName = currentMethod, args = currentArgs, internal, results} = {}){
    currentMethod = methodName
    currentArgs = args
    apply(el, render(...arguments))
    flask.updateCode(`// Enter js here to test the method\napi.${methodName}();`)
  }

  // Event binding
  el.addEventListener('click', evt => {
    if(evt.target.matches('.send-btn')) {
      // Get the code
      let code = flask.getCode()

      let promise
      try {
        promise = eval(code)
      }  catch (err) {
        alert("Invalid javascript")
        console.log(err)
      }

      if(promise){
        promise.then(resp => {
          update({results: resp})
        })
      }
      
      
      
      
    }
  })
  
  return {update}
}

let methods = []
let main = mainSection()

let methodList = MethodsList((methodName) => {
  let method = methods.find(m => m.name === methodName)
  main.update({methodName: method.name, internal: method.internal, args: method.args})
})

let urlMethod = window.location.hash.split('#/')[1]

api.getEndpoints().then(_methods => {
  methods = _methods
  methodList.update(methods)

  // Update the main screen also
  let current = methods.find(m => m.name === urlMethod)
  
  if(!current) {
    window.location.hash = ''
  } else {
    main.update({methodName: current.name, internal: current.internal, args: current.args})
  }

})