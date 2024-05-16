const generateForm = document.querySelector(".generator");
const imageGallery = document.querySelector(".img-gallery");
const OPENAI_API_KEY = "sk-proj-BqxtXT1QFXi5ahAK8SVdT3BlbkFJYW18f0krB6ArZ2zl4eHm";
const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
      const imgCard = imageGallery.querySelectorAll(".img-card")[index];
      const imgElement = imgCard.querySelector("img");
      const download = imgCard.querySelector(".download");

      const aiGeneratedImage = `data:image/jpeg;base64,${imgObject.b64_json}`;
      imgElement.src = aiGeneratedImage;

      imgElement.onload = () => {
        imgCard.classList.remove("loading");
        download.setAttribute("href", aiGeneratedImage);
        download.setAttribute("download", `${new Date().getTime()}.jpg`);
      }


    });
}

const generateAiImages = async (userPrompt, ImageQuantity) => {
    try {
  

        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                prompt : userPrompt,
                n : parseInt(ImageQuantity),
                size : "512x512",
                response_format : "b64_json"
            })

        });

        if(!response.ok) throw new Error ("Failed to generate image.Please try again ")

        const { data } = await response.json();
        updateImageCard([...data]);

    } catch (error) {
        
        alert(error.message);
    }
}


const handleFormSubmission = (e) => {

    e.preventDefault();

    const userPrompt = e.srcElement[0].value;
    const ImageQuantity = e.srcElement[1].value;

    const imageGallerymark = Array.from({ length: ImageQuantity }, () =>
        `<div class="img-card loading">
<img src="./assets/loader.svg" alt="gallery-collecton">
<a href="" class="download">
    <img src="./assets/downloads.png" alt="download-icon">
</a>
</div>`

    ).join("");

    imageGallery.innerHTML = imageGallerymark;
    generateAiImages(userPrompt, ImageQuantity);

}

generateForm.addEventListener("submit", handleFormSubmission);
