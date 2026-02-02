class Progress {
  constructor(element, index) {
    this.element = element;

    this.state = {
      index: index,
      value: 0,
      isAnimated: false,
      isRotated: false,
      isHidden: false,
    };

    this.arc = element.querySelector(".progress-circle__arc");
    this.valueInput = element.querySelector(".progress-control__value");
    this.animateToggle = element.querySelector(".progress-control__animate");
    this.rotateToggle = element.querySelector(".progress-control__rotate");
    this.hideToggle = element.querySelector(".progress-control__hide");
    const radius = window
      .getComputedStyle(this.arc)
      .getPropertyValue("r")
      .replace(/[^0-9]/g, "");
    this.circumference = 2 * Math.PI * radius;

    this._initDOM();
  }

  // Общие методы

  getValue() {
    return this.state.value;
  }

  setValue(value) {
    const valueResult = Math.max(
      0,
      Math.min(100, parseInt(String(value).replace(/[^0-9]/g, ""), 10) || 0),
    );
    this.state.value = valueResult;
    this._updateArc();
    this.valueInput.value = valueResult;
  }

  toggleAnimation(isAnimated) {
    this.state.isAnimated = isAnimated;
    this.animateToggle.checked = isAnimated;
    this._toggleAnimation();
  }

  toggleRotation(isRotated) {
    if (this.state.isAnimated) {
      this.state.isRotated = isRotated;
      this.rotateToggle.checked = isRotated;
      this._toggleRotation();
    } else {
      this.state.isRotated = false;
      this.rotateToggle.checked = false;
      this._toggleRotation();
    }
  }

  toggleHiding(isHidden) {
    this.state.isHidden = isHidden;
    this.hideToggle.checked = isHidden;
    this._toggleHiding();
  }

  reset() {
    this.toggleAnimation(false);
    this.toggleRotation(false);
    this.setValue(0);
    this.toggleHiding(false);
  }

  // Вспомогательные методы

  _initDOM() {
    this.valueInput.addEventListener("input", (e) => {
      this.setValue(e.target.value);
    });

    this.animateToggle.addEventListener("change", (e) => {
      this.toggleAnimation(e.target.checked);
    });

    this.rotateToggle.addEventListener("change", (e) => {
      this.toggleRotation(e.target.checked);
    });

    this.hideToggle.addEventListener("change", (e) => {
      this.toggleHiding(e.target.checked);
    });

    this._updateArc();
  }

  _updateArc() {
    this.arc.style.strokeDashoffset =
      this.circumference - (this.circumference * this.state.value) / 100;
  }

  _toggleAnimation() {
    if (this.state.isAnimated) {
      this.element.classList.add("progress--animated");
      this.valueInput.setAttribute("disabled", "true");
      this.rotateToggle.removeAttribute("disabled");
      this._stopAnimation();
      this._startAnimation();
    } else {
      this.element.classList.remove("progress--animated");
      this._stopAnimation();
      this.valueInput.removeAttribute("disabled");
      this.rotateToggle.setAttribute("disabled", "true");
      this.rotateToggle.checked = false;
      this.state.isRotated = false;
      this._toggleRotation();
    }
  }

  _startAnimation() {
    let animationAccumulate = 0;
    this.animationInterval = setInterval(() => {
      animationAccumulate += this.circumference / 100;
      let animationAccumulateResult = this.circumference - animationAccumulate;
      this.arc.style.strokeDashoffset = animationAccumulateResult;
    }, 20);
  }

  _stopAnimation() {
    clearInterval(this.animationInterval);
    this.arc.style.transition = "none";
    this.arc.style.strokeDashoffset = this.circumference;
    setTimeout(() => {
      this.arc.style.transition = "";
    }, 0);
  }

  _toggleRotation() {
    if (this.state.isRotated) {
      this.element.classList.add("progress--rotated");
    } else {
      this.element.classList.remove("progress--rotated");
    }
  }

  _toggleHiding() {
    if (this.state.isHidden) {
      this.element.classList.add("progress--hidden");
      this.element.classList.remove("progress--animated");
      this.element.classList.remove("progress--rotated");
      this.setValue(0);
      this.toggleAnimation(false);
      this.toggleRotation(false);
      this.valueInput.setAttribute("disabled", "true");
      this.animateToggle.setAttribute("disabled", "true");
      this.rotateToggle.setAttribute("disabled", "true");
    } else {
      this.element.classList.remove("progress--hidden");
      this.valueInput.removeAttribute("disabled", "true");
      this.animateToggle.removeAttribute("disabled", "true");
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const progressElements = document.querySelectorAll(".progress");
  const progressInstances = [];

  progressElements.forEach((element, index) => {
    const progress = new Progress(element, index);
    progressInstances.push(progress);
  });

  window.progressInstances = progressInstances;
});
