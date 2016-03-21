$(() => {
    const createStore = Redux.createStore;
    const ADD_CAT = 'ADD_CAT'
    const $catTable = $('.cat-table')

    function catclicker(state = [], action){
        switch (action.type) {
            case ADD_CAT:
                let retorno = state
                action.cat['id'] = state.length + 1
                retorno.push(action.cat)
                return retorno
            default:
                console.log(state)

        }
    }

    const store = createStore(catclicker);

    function addCat(cat = {}){
        return {
            type: ADD_CAT,
            cat: cat
        }
    }

    store.subscribe(() => {
        console.log(store.getState())
        buildCatList(store.getState())
    })

    function buildCatList(state) {
        let $listGroup = $('<div>').addClass('list-group')
        for (let cat of state){
            let $listItem = $('<a>').addClass('list-group-item')
            $listItem.attr('href', '#')
            $listItem.data('cat-id', cat.id)
            $listItem.html(cat.nome)
            $listGroup.append($listItem)
        }

        $catTable.html($listGroup)
    }

    $('#cat-form').submit((event) => {
        event.preventDefault()
        let serializedForm = $('#cat-form').serializeArray()
        let cat = {
            nome: serializedForm[0].value,
            urlFoto: serializedForm[1].value,
            clicks: 0
        }

        store.dispatch(addCat(cat))
    })
})
