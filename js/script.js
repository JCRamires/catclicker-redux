$(() => {
    const ADD_CAT = 'ADD_CAT'
    const CLICK_CAT = 'CLICK_CAT'
    const UPDATE_CHOSEN_ONE = 'UPDATE_CHOSEN_ONE'

    const createStore = Redux.createStore;
    const store = createStore(catclicker);

    const $catTable = $('.cat-table')
    const $content = $('.content')

    function catclicker(state = {chosenOne: undefined, cats: new Map()}, action){
        let newState = state

        switch (action.type) {
            case ADD_CAT:
                newState.cats.set(state.cats.size+1, action.cat)
                return newState
            case CLICK_CAT:
                let cat = newState.cats.get(action.catId)
                cat.clicks = cat.clicks + 1
                newState.cats.set(action.catId, cat)
                return newState
            case UPDATE_CHOSEN_ONE:
                newState.chosenOne = action.catId
                return newState
            default:
                console.log(state)
        }
    }

    function addCat(cat = {}){
        return {
            type: ADD_CAT,
            cat: cat
        }
    }

    function clickCat(catId){
        return {
            type: CLICK_CAT,
            catId
        }
    }

    function updateChosenOne(catId){
        return {
            type: UPDATE_CHOSEN_ONE,
            catId
        }
    }

    store.subscribe(() => {
        let state = store.getState()
        console.log(state)
        buildCatList(state)
        showTheChosenOne(state)
    })

    function buildCatList(state) {
        let $listGroup = $('<div>').addClass('list-group')
        for (let [catId, cat] of state.cats){
            let $listItem = $('<a>').addClass('list-group-item')
            $listItem.addClass('list-cat')
            $listItem.attr('href', '#')
            $listItem.attr('data-cat-id', catId)
            $listItem.html(cat.nome)
            $listGroup.append($listItem)
        }

        $catTable.html($listGroup)
    }

    function showTheChosenOne(state){
        if (state.chosenOne !== undefined){
            let theChosenOne = state.cats.get(state.chosenOne)

            let $catPage = $('<div>')
            let $catImage = $('<img>').attr('src', theChosenOne.urlFoto)
            $catImage.addClass('img-responsive').addClass('the-chosen-one')
            $catImage.attr('data-cat-id', state.chosenOne)
            let $catInfo = $('<div>').html(`${theChosenOne.nome} - ${theChosenOne.clicks} clicks`)

            $catPage.append($catImage)
            $catPage.append($catInfo)

            $content.html($catPage)
        }
    }

    $('#cat-form').submit((event) => {
        event.preventDefault()
        let serializedForm = $(event.target).serializeArray()
        let cat = {
            nome: serializedForm[0].value,
            urlFoto: serializedForm[1].value,
            clicks: 0
        }

        store.dispatch(addCat(cat))
    })

    $catTable.on('click', '.list-cat', (event) => {
        let catId = $(event.target).data('cat-id')
        store.dispatch(updateChosenOne(catId))
    })

    $content.on('click', '.the-chosen-one', (event) => {
        let catId = $(event.target).data('cat-id')
        store.dispatch(clickCat(catId))
    })
})
