

export default function Button(probs) {

    function disableButton() {
        // Disable the button
        document.querySelector("button").disabled = true;
      }
  return (
    <button onClick={probs.msg === "" ? disableButton: probs.etat}>Démarrer la discussion</button>
    )
}
