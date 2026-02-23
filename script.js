// Input Elements
const nameInput = document.getElementById("profile_name_input");
const imageUpload = document.getElementById("profile_image_upload");
const rankSelect = document.getElementById("ranking_badge");
const specialtySelect = document.getElementById("specialty_input");

// Card Elements
const cardName = document.getElementById("profile_card_name");
const cardImage = document.getElementById("profile_image");
const cardMagBadge = document.getElementById("mag_frame_img");
const cardRank = document.getElementById("profile_rank");
const cardSpecialty = document.getElementById("profile_specialty");
const cardWrapper = document.getElementById("card_wrapper_target");

// Download Elements
const downloadBtn = document.getElementById("download_btn_action");

// Magnitude Color Mapping
const magColors = {
    "1": "#F7EAB7",
    "2": "#50E3C2",
    "3": "#7ED321",
    "4": "#BDFF8C",
    "5": "#B8E986",
    "6": "#F8E71C",
    "7": "#F5A623",
    "8": "#F1442E",
    "9": "#55CDFC"
};

// 1. Live Name Update
nameInput.addEventListener("input", (e) => {
    cardName.innerText = e.target.value;
});

// 2. Live Image Upload Preview
imageUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            cardImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// 3. Live Rank, Badge, and Color Update
rankSelect.addEventListener("change", (e) => {
    const rankValue = e.target.value;
    
    // Update Text
    cardRank.innerText = `Mag ${rankValue}`;
    
    // Update Badge Image Path (e.g., /mag_1.png, /mag_2.png)
    cardMagBadge.src = `/mag_${rankValue}.png`; 
    
    // Update Card Background Color dynamically
    const selectedColor = magColors[rankValue];
    cardWrapper.style.background = `linear-gradient(45deg, ${selectedColor}, rgba(255, 255, 255, 0.6))`;
});

// 4. Live Specialty Update
specialtySelect.addEventListener("change", (e) => {
    cardSpecialty.innerText = e.target.value;
});

// 5. Download Functionality (Targeting inner wrapper for clean image)
downloadBtn.addEventListener("click", () => {
    const scale = 2; // 2x or 3x for higher resolution
    const width = cardWrapper.clientWidth;
    const height = cardWrapper.clientHeight;

    domtoimage.toPng(cardWrapper, {
        width: width * scale,
        height: height * scale,
        style: {
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${width}px`,
            height: `${height}px`
        }
    })
    .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'Seismic_Card.png';
        link.href = dataUrl;
        link.click();
    })
    .catch((error) => {
        console.error('Oops, something went wrong!', error);
    });
});