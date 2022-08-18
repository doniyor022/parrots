const productTemplate = document.querySelector('#template')

const renderProduct = function (product) {
  const { id, title, img, price, birthDate, sizes, features } = product

  const elProduct = productTemplate.content.cloneNode(true)

  const elProductImg = elProduct.querySelector('.parrot-img')
  elProductImg.src = img

  const elProductTitle = elProduct.querySelector('.parrot-title')
  elProductTitle.textContent = title

  const elProductPrice = elProduct.querySelector('.parrot-price')
  elProductPrice.textContent = price

  const elProductSizes = elProduct.querySelector('.parrot-sizes')
  elProductSizes.textContent = sizes

  const elProductBirth = elProduct.querySelector('.parrot-birthDate')
  elProductBirth.textContent = birthDate

  const elProductFeatures = elProduct.querySelector('.parrot-features')
  elProductFeatures.textContent = features

  const parrotEdit = elProduct.querySelector('.edit-parrot')
  parrotEdit.setAttribute('data-id', id)

  return elProduct
}

let showingProducts = products.slice()

const elParrotsWrapper = document.querySelector('.parrots-wrapper')

const renderProducts = function () {
  elParrotsWrapper.innerHTML = ''

  const productsFragment = document.createDocumentFragment()
  showingProducts.forEach(function (product) {
    const productItem = renderProduct(product)
    productsFragment.append(productItem)
  })
  elParrotsWrapper.append(productsFragment)
}
renderProducts()

elFilterForm = document.querySelector('.filter')

elFilterForm.addEventListener('submit', function (evt) {
  evt.preventDefault()

  const elements = evt.target.elements
  const fromValue = elements.from.value
  const toValue = elements.to.value
  const searchValue = evt.target.elements.search.value
  const sortValue = elements.sortby.value

  const searchRegExp = new RegExp(searchValue, 'gi')
  showingProducts = products
    .filter(function (product) {
      return product.title.match(searchRegExp)
    })
    .sort(function (a, b) {
      switch (sortValue) {
        case '1':
          if (a.name > b.name) {
            return 1
          } else if (a.name < b.name) {
            return -1
          } else {
            return 0
          }
        case '2':
          return a.price - b.price
        case '3':
          return b.price - a.price
        default:
          break
      }
    })
  renderProducts()
})

const editTitle = document.querySelector('#editParrotTitle')
const editImg = document.querySelector('#editParrotImg')
const editPrice = document.querySelector('#editPrice')
const editDate = document.querySelector('#editParrotDate')
const editFeatures = document.querySelector('#editFeatures')
const editList = document.querySelector('#edit-list')
const editForm = document.querySelector('#edit-form')
const editParrotModal = new bootstrap.Modal(
  document.querySelector('#edit-parrot-modal')
)

let indexEditItem = null

editList.addEventListener('click', function (evt) {
  evt.preventDefault()

  if (evt.target.matches('.js-edit')) {
    const indexCardItem = products.findIndex(
      (item) => evt.target.dataset.id == item.id
    )
    indexEditItem = indexCardItem
  }
})

elParrotsWrapper.addEventListener('click', function (evt) {
  if (evt.target.matches('.btn-danger')) {
    const clickedItemId = evt.target.dataset.id
    const clickedItemIndex = products.findIndex(function (product) {
      return product.id === clickedItemId
    })

    const clickedShowingItemIndex = showingProducts.findIndex(function (
      product
    ) {
      return product.id === clickedItemId
    })

    showingProducts.splice(clickedShowingItemIndex, [1])
    products.splice(clickedItemIndex, [1])

    renderProducts()
  } else if (evt.target.matches('.btn-secondary')) {
    const clickedId = +evt.target.dataset.id

    const clickedItem = products.find(function (product) {
      return product.id === clickedId
    })
    editTitle.value = clickedItem.title
    editImg.value = clickedItem.img
    editPrice.value = clickedItem.price
    editDate.value = clickedItem.birthDate
    editFeatures.value = clickedItem.features

    editForm.setAttribute('data-editing-id', clickedItem.id)
  }
})
renderProducts()

// edit

editForm.addEventListener('submit', function (evt) {
  evt.preventDefault()
  const editingId = evt.target.dataset.editingId

  const titleValue = editTitle.value
  const imgValue = editImg.value
  const priceValue = editPrice.value
  const dateValue = editDate.value
  const featuresValue = editFeatures.value

  if (
    titleValue.trim() &&
    imgValue.trim() &&
    priceValue.trim() &&
    dateValue.trim() &&
    featuresValue.trim()
  ) {
    const product = {
      id: editingId,
      title: titleValue,
      img: imgValue,
      price: priceValue,
      date: new Date().toISOString(),
      features: featuresValue,
    }
    // Shunaqa qilib hamma obyektidigi key ni ozgartirish mumkin
    products[indexEditItem].title = titleValue
    products[indexEditItem].img = imgValue
    products[indexEditItem].price = priceValue
    products[indexEditItem].date = dateValue

    const editingItemIndex = products.findIndex(function (product) {
      return product.id === editingId
    })

    const editingShowItemIndex = showingProducts.findIndex(function (product) {
      return product.id === editingId
    })

    renderProducts()
  }
})

// addForm

for (let i = 0; i < products.length; i++) {
  const currentProduct = products[i]
  const elProduct = renderProduct(currentProduct)
}

const addForm = document.querySelector('#add-form')
const addParrotModal = new bootstrap.Modal(
  document.querySelector('#add-parrot-modal')
)

addForm.addEventListener('submit', function (evt) {
  evt.preventDefault()

  const elements = evt.target.elements

  const titleValue = elements.parrotTitle.value
  const imgValue = elements.parrotImg.value
  const priceValue = elements.price.value
  const dateValue = elements.parrotDate.value
  const featuresValue = elements.features.value

  if (
    titleValue.trim() &&
    priceValue.trim() &&
    featuresValue.trim() &&
    imgValue.trim() &&
    dateValue.trim()
  ) {
    const product = {
      id: Math.floor(Math.random() * 1000),
      title: titleValue,
      img: imgValue,
      price: priceValue,
      date: new Date().toISOString(),
      features: featuresValue,
    }
    products.push(product)

    addForm.reset()
    addParrotModal.hide()

    const elProduct = renderProduct(product)
    elParrotsWrapper.append(elProduct)
  }
})
