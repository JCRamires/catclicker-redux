$(() => {
    const ADD_CAT = 'ADD_CAT'
    const CLICK_CAT = 'CLICK_CAT'
    const UPDATE_CHOSEN_ONE = 'UPDATE_CHOSEN_ONE'

    const defaultCats = new Map()
    defaultCats.set(1, {nome: 'Taco cat', urlFoto: 'https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg', clicks: 0})
    defaultCats.set(2, {nome: 'Burger cat', urlFoto: 'http://giveitlove.com/wp-content/uploads/600x401xBurger-Cat-Halloween-Costume.jpg.pagespeed.ic.L22zrezT2D.jpg', clicks: 0})
    defaultCats.set(3, {nome: 'Long cat', urlFoto: 'http://i1.kym-cdn.com/photos/images/facebook/000/002/110/longcat.jpg', clicks: 0})
    defaultCats.set(4, {nome: 'Ceiling cat', urlFoto: 'http://www.allmystery.de/i/t8cf3e2_ceilingcat.jpg', clicks: 0})

    const createStore = Redux.createStore;
    const store = createStore(catclicker);

    const $catTable = $('.cat-table')
    const $content = $('.content')

    function catclicker(state = {chosenOne: undefined, cats: defaultCats}, action){
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
                return state
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

    let currentState
    function handleChanges(){
        let previousState = currentState
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
            let $catInfo = $('<div>').html(`<h2>${theChosenOne.nome} - ${theChosenOne.clicks} clicks</h2>`)

            $catPage.append($catInfo)
            $catPage.append($catImage)
            $content.html($catPage)
        }
    }

    function limpaFormTabajara(){
        $('#nomeGato').val('')
        $('#urlGato').val('')
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
        limpaFormTabajara()
    })

    $catTable.on('click', '.list-cat', (event) => {
        let catId = $(event.target).data('cat-id')
        store.dispatch(updateChosenOne(catId))
    })

    $content.on('click', '.the-chosen-one', (event) => {
        let catId = $(event.target).data('cat-id')
        store.dispatch(clickCat(catId))
    })

    buildCatList(store.getState())
})
