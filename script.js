const cardNumberDisplay = document.querySelector(".displayNumber");
const cardholderDisplay = document.querySelector(".displayName");
const dateDisplay = document.querySelector(".displayYear");
const cvcDisplay = document.querySelector(".displayCvc");
const form = document.querySelector("form");
const thanksScreen = document.querySelector(".thanksWrapper");

const submitButton = document.querySelector("input[type=submit]");
const continueButton = thanksScreen.querySelector("button");

const inputs = document.querySelectorAll("input[type=text]");

function showError(input, message) {
  const alert = input.nextElementSibling;
  const monthAlert = input.nextElementSibling.nextElementSibling;

  if (alert.nodeName === "P") {
    alert.textContent = message;
    alert.classList.add("alert");
    input.classList.add("error");
  } else {
    monthAlert.textContent = message;
    monthAlert.classList.add("alert");
    input.classList.add("error");
  }

  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove("alert");
    input.classList.remove("error");
    if (monthAlert) {
      monthAlert.textContent = "";
      monthAlert.classList.remove("alert");
    }
  }, 5000);
}

function validateInputs() {
  const values = {};

  const digitRegex = /^\d+$/;
  const stringRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;

  const status = Array.from(inputs).map((input) => {
    if (input.value.length === 0) {
      showError(input, `Can't be blank`);
      return false;
    }

    if (input.id === "name") {
      const name = input.value;

      if (!stringRegex.test(name)) {
        showError(input, "Wrong format, alphabets only");
        return false;
      } else if (name.length > 16) {
        showError(input, "Name is too long. Only 16 characters allowed");
        return false;
      }
      values.name = name;
      return true;
    }

    if (input.id === "cardNumber") {
      const number = input.value;

      if (!digitRegex.test(number)) {
        showError(input, "Wrong Format, numbers only");
        return false;
      } else if (number.length < 16) {
        showError(input, "Please enter a valid card number");
        return false;
      }

      values.number = number.match(/.{1,4}/g)?.join(" ") || "";
      return true;
    }

    if (input.id === "month") {
      const month = input.value;

      if (month <= 0 || month > 12) {
        showError(input, "Please enter a valid month");
        return false;
      }

      values.month = month;
      return true;
    }

    if (input.id === "year") {
      const year = input.value;
      const date = new Date();
      const currYear = String(date.getFullYear()).slice(2, 4);

      if (year < Number(currYear)) {
        showError(input, "Card is expired");
        return false;
      }

      values.year = year;
      return true;
    }

    if (input.id === "cvc") {
      const cvc = input.value;

      if (!digitRegex.test(cvc)) {
        showError(input, "Wrong format, numbers only");
        return false;
      } else if (cvc.length < 3) {
        showError(input, "Invalid CVC number");
        return false;
      }

      values.cvc = cvc;
      return true;
    }
  });

  return status.every((val) => val === true) ? values : null;
}

submitButton.addEventListener("click", (event) => {
  event.preventDefault();

  const values = validateInputs();

  if (values) {
    cardNumberDisplay.textContent = values.number;
    cardholderDisplay.textContent = values.name.toUpperCase();
    dateDisplay.textContent = `${values.month}/${values.year}`;
    cvcDisplay.textContent = values.cvc;

    form.classList.add("hidden");
    thanksScreen.classList.remove("hidden");
  }
});

continueButton.addEventListener("click", () => {
  inputs.forEach((input) => {
    input.value = "";
  });

  cardNumberDisplay.textContent = "0000 0000 0000 0000";
  cardholderDisplay.textContent = "JANE APPLESEED";
  dateDisplay.textContent = `00/00`;
  cvcDisplay.textContent = "000";

  form.classList.remove("hidden");
  thanksScreen.classList.add("hidden");
});
