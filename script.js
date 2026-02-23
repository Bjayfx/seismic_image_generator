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
const displayName = document.querySelector(".card_header .identity .name");

// Download Elements
const downloadBtn = document.getElementById("download_btn_action");

const hasGeneratorElements =
    nameInput && imageUpload && rankSelect && specialtySelect &&
    cardName && cardImage && cardMagBadge && cardRank && cardSpecialty && cardWrapper && downloadBtn;

if (hasGeneratorElements) {
    const rankTone = {
        "1": "#d8d8d8",
        "2": "#b2d8f2",
        "3": "#afdbc7",
        "4": "#f0d49b",
        "5": "#f3c2b4",
        "6": "#f2b7b7",
        "7": "#f5a780",
        "8": "#ec8d7f",
        "9": "#cf9adb"
    };

    const updateDisplayName = (value) => {
        const normalized = value.trim();
        const text = normalized || "John Doe";
        cardName.textContent = text;
        if (displayName) {
            displayName.textContent = text.toUpperCase();
        }
    };

    const updateRank = (rankValue) => {
        cardRank.textContent = `Mag ${rankValue}`;
        cardMagBadge.src = `mag_${rankValue}.png`;

        const selectedTone = rankTone[rankValue] || "#f5f5f5";
        cardWrapper.style.background = `linear-gradient(140deg, #ffffff 0%, ${selectedTone} 100%)`;
    };

    updateDisplayName(nameInput.value);
    cardSpecialty.textContent = specialtySelect.value;
    updateRank(rankSelect.value);

    nameInput.addEventListener("input", (e) => updateDisplayName(e.target.value));

    imageUpload.addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            cardImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    rankSelect.addEventListener("change", (e) => updateRank(e.target.value));

    specialtySelect.addEventListener("change", (e) => {
        cardSpecialty.textContent = e.target.value;
    });

    downloadBtn.addEventListener("click", async () => {
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = "Preparing image...";
        downloadBtn.disabled = true;

        try {
            const dataUrl = await domtoimage.toPng(cardWrapper, {
                quality: 1,
                bgcolor: "#ffffff",
                width: cardWrapper.offsetWidth * 3,
                height: cardWrapper.offsetHeight * 3,
                style: {
                    transform: "scale(3)",
                    transformOrigin: "top left",
                    width: `${cardWrapper.offsetWidth}px`,
                    height: `${cardWrapper.offsetHeight}px`
                }
            });

            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            const safeName = (nameInput.value.trim() || "Seismic").replace(/\s+/g, "_");
            const link = document.createElement("a");
            link.download = `${safeName}_Card.png`;
            link.href = objectUrl;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error("Image download failed", error);
            alert("Could not generate image. Please try again.");
        } finally {
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
        }
    });
}
