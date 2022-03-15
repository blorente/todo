<script lang="ts">
import Todo from "./components/Todo.svelte";



</script>

<main id="mainpanel" class="is-widescreen">
	<section id="mainpanel" class="hero is-fullheight">
        <Todo />
	</section>
</main>

<style lang="scss" global>
    @import "styles.scss";

    #mainpanel {
        background-color: $grey-dark;
    }
</style>
