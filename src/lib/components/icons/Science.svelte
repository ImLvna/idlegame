<script>
  import { faFlask } from '@fortawesome/free-solid-svg-icons/faFlask';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import Themable from '../Themable.svelte';
   // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
</script>

<Themable text={"white"} class="pr-1">
  <FontAwesomeIcon icon={faFlask} />
</Themable>
