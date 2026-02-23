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
const rankAccent = document.getElementById("rank_accent");
const exportTarget = document.getElementById("export_target");
const displayName = document.querySelector(".card_header .identity .name");

// Download Elements
const downloadBtn = document.getElementById("download_btn_action");

const hasGeneratorElements =
    nameInput && imageUpload && rankSelect && specialtySelect &&
    cardName && cardImage && cardMagBadge && cardRank && cardSpecialty && cardWrapper &&
    rankAccent && exportTarget && downloadBtn;

if (hasGeneratorElements) {
    const rankTone = {
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
        rankAccent.style.background = selectedTone;
        cardWrapper.style.background = `linear-gradient(140deg, #ffffff 0%, ${selectedTone}44 100%)`;
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
        downloadBtn.textContent = "Preparing mockup...";
        downloadBtn.disabled = true;

        try {
            const width = exportTarget.offsetWidth;
            const height = exportTarget.offsetHeight;

            const dataUrl = await domtoimage.toPng(exportTarget, {
                quality: 1,
                bgcolor: "#8a603d",
                width: width * 2,
                height: height * 2,
                style: {
                    transform: "scale(2)",
                    transformOrigin: "top left",
                    width: `${width}px`,
                    height: `${height}px`
                }
            });

            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            const safeName = (nameInput.value.trim() || "Seismic").replace(/\s+/g, "_");
            const link = document.createElement("a");
            link.download = `${safeName}_mockup.png`;
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
