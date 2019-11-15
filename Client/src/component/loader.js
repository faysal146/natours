function showLoader(selelctor) {
     console.log(selelctor)
     const el = document.querySelector(selelctor);
     el.disabled = true
     el.innerHTML += '<div class="loading"></div'
}

function hideLoader () {
     const el = document.querySelector('.loading');
     el.parentElement.disabled = false
     el.parentElement.removeChild(el)
}

export {showLoader,hideLoader}