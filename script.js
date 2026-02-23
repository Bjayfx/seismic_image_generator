// Input Elements
const nameInput = document.getElementById("profile_name_input");
const imageUpload = document.getElementById("profile_image_upload");
const rankSelect = document.getElementById("ranking_badge");
const specialtySelect = document.getElementById("specialty_input");

// Card Elements
const cardName = document.getElementById("profile_card_name");
const headingName = document.getElementById("profile_heading_name");
const cardImage = document.getElementById("profile_image");
const cardMagBadge = document.getElementById("mag_frame_img");
const cardRank = document.getElementById("profile_rank");
const cardSpecialty = document.getElementById("profile_specialty");
const cardSpecialtyText = document.getElementById("profile_specialty_text");
const cardWrapper = document.getElementById("card_wrapper_target");
const rankStripe = document.getElementById("rank_stripe");
const exportTarget = document.getElementById("export_target");

// Download Elements
const downloadBtn = document.getElementById("download_btn_action");

const hasGeneratorElements =
    nameInput && imageUpload && rankSelect && specialtySelect &&
    cardName && headingName && cardImage && cardMagBadge && cardRank &&
    cardSpecialty && cardSpecialtyText && cardWrapper && rankStripe && exportTarget && downloadBtn;

if (hasGeneratorElements) {
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

    const updateDisplayName = (value) => {
        const normalized = value.trim() || "John Doe";
        cardName.textContent = normalized;
        headingName.textContent = normalized.toUpperCase();
    };

    const updateSpecialty = (value) => {
        cardSpecialty.textContent = value;
        cardSpecialtyText.textContent = value;
    };

    const updateRank = (rankValue) => {
        cardRank.textContent = `Mag ${rankValue}`;
        cardMagBadge.src = `mag_${rankValue}.png`;

        const selectedColor = magColors[rankValue] || magColors["1"];
        exportTarget.style.setProperty("--mag-accent", selectedColor);
        exportTarget.style.setProperty("--mag-soft", `${selectedColor}55`);
        rankStripe.style.background = selectedColor;

        cardWrapper.style.background = `
            linear-gradient(130deg, rgba(255,255,255,0.92), rgba(245,245,245,0.86)),
            radial-gradient(circle at 22% 20%, ${selectedColor}55, transparent 44%)
        `;
    };

    updateDisplayName(nameInput.value);
    updateSpecialty(specialtySelect.value);
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
    specialtySelect.addEventListener("change", (e) => updateSpecialty(e.target.value));

    downloadBtn.addEventListener("click", async () => {
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = "Preparing image...";
        downloadBtn.disabled = true;

        try {
            const width = exportTarget.offsetWidth;
            const height = exportTarget.offsetHeight;
            const scale = 3;

            const dataUrl = await domtoimage.toPng(exportTarget, {
                quality: 1,
                bgcolor: "transparent",
                cacheBust: true,
                width: width * scale,
                height: height * scale,
                style: {
                    transform: `scale(${scale})`,
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
            link.download = `${safeName}_card_mockup.png`;
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
