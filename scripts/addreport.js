
function showForm() {
    var unsafeForm = document.getElementById("unsafeForm");
    var compromisedForm = document.getElementById("compromisedForm");
    var unsafeRadio = document.getElementById("unsafe");
    var compromisedRadio = document.getElementById("compromised");

    if (unsafeRadio.checked) {
        unsafeForm.style.display = "block";
        compromisedForm.style.display = "none";
    } else if (compromisedRadio.checked) {
        unsafeForm.style.display = "none";
        compromisedForm.style.display = "block";
    }
}
					