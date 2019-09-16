import AbstractComponent from './abstract-component';

class Sort extends AbstractComponent {
  getTemplate() {
    return `<ul class="sort">
    <li>
      <a href="#" data-sort-type="default" class="sort__button">Sort by default</a>
    </li>
    <li>
      <a href="#" data-sort-type="date" class="sort__button">Sort by date</a>
    </li>
    <li>
      <a href="#" data-sort-type="rating" class="sort__button">Sort by rating</a>
    </li>
  </ul>`;
  }
}

export {Sort as default};
