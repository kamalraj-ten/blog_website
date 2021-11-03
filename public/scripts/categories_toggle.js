function toggle(element){
    let cb = element.children.item('input')
    if(cb.getAttribute('checked')==null){
        cb.setAttribute('checked','checked')
        element.setAttribute('class','btn btn-success m-3')
    }else{
        cb.removeAttribute('checked')
        element.setAttribute('class','btn btn-outline-success m-3')
    }
    console.log(cb)
}