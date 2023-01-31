import {onCleanup} from "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      formSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent>;
    }
  }
}

export default function formSubmit(el, accessor) {
  const onSubmit = event => {
    event.preventDefault();
    accessor()(event);
  }

  el.addEventListener('submit', onSubmit);
  onCleanup(() => el.removeEventListener('submit', onSubmit))
}
