import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   *Render the recived object to the DOM
   * @param {Object| Object[]} data The data to be rendered (e.g. recipe)//means we are expecting an array of object
   * @param {boolean} [render=true] If false create markup string instead of rendering to the DOM
   * @returns {undefined | undefined} A markup stringis returned if render=false
   * @this {Object} View instance
   * @author Agnes Brettl
   * @todo Finish the implementation
   */

  render(data, render = true) {
    //check if data exist
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data; //stores randering recipe's data
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //Implementing a method that will update the DOM but only in places where text and attributes change
  //Create new markup but not render it, generate this markup and compare that new html to a cur html, and  then only change text and attributes that changed of the old version to new version
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();
    this._data = data; //stores randering recipe's data
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(curElements);
    // console.log(newElements);

    //loop over 2 array at the same time
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //isEqualNode compare the 2 arrays
      // console.log(curEl, newEl.isEqualNode(cu  rEl));

      //Updates change TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('????', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      ////Updates change ATTRIBUTES
      if (!newEl.isEqualNode(curEl))
        // console.log(newEl.attributes);
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );

      // console.log(newEl.attributes);
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  //Render a spinner
  renderSpinner() {
    const markup = `<div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
