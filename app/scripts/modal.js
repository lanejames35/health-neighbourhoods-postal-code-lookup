// access the elements involved with the modal
const openButton = document.getElementById('modal-open')
const closeButton = document.getElementById('modal-close')
const modal = document.querySelector(".modal")
const backdrop = document.querySelector(".container")

function closeModal(){
    modal.style.display = 'none'
    backdrop.style.display = 'none'
}

openButton.addEventListener("click", () =>{
    modal.style.display = 'block'
    backdrop.style.display = 'block'
})
closeButton.addEventListener("click", () =>{
   closeModal()
})
backdrop.addEventListener("click", () => {
    closeModal()
})
