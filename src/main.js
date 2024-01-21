import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const baseUrl = "https://pixabay.com";
const endPoint = "api/";
const apiKey = "41917701-79d925887e26991e7dbaf3a79";
const galleryForm = document.querySelector(".gallery-form");

galleryForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const {name} = galleryForm.elements;
    const searchText = name.value.trim();
    const loader = document.querySelector(".loader");
    loader.style.display = "block";
    if (!searchText) {
        alert("Please fill search string before submitting.");
    }
    else if (name.value.length < 3) {
        alert("Search string must be not less then 3 symbols.");
    }

    searchImages(searchText).then(
        (data) => {
            loader.style.display = "none";
            if (data.hits && data.hits.length > 0) {
                showImages(data.hits);
            } else {
          iziToast.error({
          title: "Error",
          message: "Sorry, there are no images matching your search query. Please try again!",
        });
            }
        })
      .catch((error) => {
          console.error("Error fetching images:", error);
      })
    .finally (() => galleryForm.reset());
    return;
});
function searchImages(query) {
    const encodedQuery = encodeURIComponent(query);
    const url = `${baseUrl}/${endPoint}?key=${apiKey}&q=${encodedQuery}&image_type=photo&orientation=horizontal&safesearch=true`;
    return fetch(url).then(
        (res) => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json();
        }
    )
}
function showImages(images) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    const galleryHTML = images.map(image => `<li class="gallery-item">
      <a class="gallery-link" href="${image.largeImageURL}">
        <img class="gallery-image" src="${image.webformatURL}" alt="${image.tags}" />
      </a>
    <p>Likes: ${image.likes}</p>
    <p>Views: ${image.views}</p>
    <p>Comments: ${image.comments}</p>
    <p>Downloads: ${image.downloads}</p>
    </li>`
    ).join("");
    gallery.innerHTML = galleryHTML;
    const lightbox = new SimpleLightbox(".gallery a", {
        animationSpeed: 250,
        captionsData: "alt",
        captionDelay: 250
    });
    lightbox.refresh();
}