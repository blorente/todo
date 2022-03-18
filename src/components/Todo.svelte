<script lang="ts">
  import { db } from "../db";
  import { liveQuery } from "dexie";
  import { flip } from "svelte/animate";
  import { fade, fly } from "svelte/transition";
  import Select from "svelte-select";

  let tasksToDo = liveQuery(() =>
    db.tasks.where("status").equals("TODO").toArray()
  );

  const possibleCategories: { value: string; label: string }[] = [
    "All",
    "Bonus",
  ].map((a) => {
    return {
      value: a,
      label: a,
    };
  });

  let newTaskName;
  let newTaskLink = "https://";
  let newTaskCategory = possibleCategories[0];
  let taskInput;
  const addNewTask = () => {
    db.tasks.add({
      name: newTaskName,
      domain: "*",
      link: newTaskLink,
      status: "TODO",
      dateAdded: new Date(Date.now()),
      category: newTaskCategory.value,
    });
    newTaskName = "";
    newTaskLink = "https://";
    newTaskCategory = possibleCategories[0];
    taskInput.focus();
  };

  const markTaskDone = (task) => {
    db.tasks.update(task, { status: "DONE" });
  };
  let visibleCategory = possibleCategories[0];
  const changeCategory = (newCategory) => {
      visibleCategory = newCategory;
  }
</script>

<div class="container panel is-dark TodoApp">
  <p class="panel-heading TodoAppTitle">BL:TODO</p>
  <div class="panel-block">
    <form class="control" on:submit|preventDefault={addNewTask}>
      <input
        class="input title is-5 TodoInput TodoInputText"
        type="text"
        placeholder="New Task"
        bind:value={newTaskName}
        bind:this={taskInput}
      />
    </form>
    <form class="control" on:submit|preventDefault={addNewTask}>
      <input
        type="text"
        class="input title is-5 TodoInput TodoInputText"
        placeholder="Task Link"
        bind:value={newTaskLink}
        on:submit={addNewTask}
      />
    </form>
    <div class="TodoSelect">
      <Select items={possibleCategories} value={newTaskCategory} />
    </div>
  </div>
  <div class="panel-block">
    <p class="control has-icons-left">
      <input
        class="input TodoInput TodoInputText"
        type="text"
        placeholder="Search"
      />
      <span class="icon is-left TodoInputText">
        <i class="fas fa-search" aria-hidden="true" />
      </span>
    </p>
  </div>
  <div class="tabs">
      <ul>
          {#each possibleCategories as category}
           {#if category.value == visibleCategory.value}
                <li class="is-active"><span on:click={() => changeCategory(category)}>{category.label}</span></li>
            {:else}
                <li><span on:click={() => changeCategory(category)}>{category.label}</span></li>
            {/if}
          {/each}
      </ul>
  </div>
  {#if $tasksToDo}
    {#each $tasksToDo as task (task.id)}
      <div
        class="panel-block TodoItem"
        animate:flip
        in:fade
        out:fly={{ x: 100 }}
      >
        <input type="checkbox" on:click={() => markTaskDone(task)} />
        <span class="title is-3">
          {#if task.link !== "https://"}
            <a href={task.link} target="_blank" class="link"
              ><span class="icon is-left TodoInputText"
                ><i class="fas fa-link" /></span
              ></a
            >
          {/if}
          {task.name}
        </span>
      </div>
    {/each}
  {/if}
</div>

<style lang="scss" global>
  @import "../styles.scss";
  $panel-heading-size: 4rem;
  $panel-tabs-font-size: 2rem;
  .TodoApp {
    width: 100vw;
    background-color: $grey-light;
  }
  .TodoAppTitle {
    font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
    font-size: 2.5rem;
  }
  .TodoInput {
    background-color: $grey-dark;
    border-color: $primary;
  }
  .TodoInputText {
    color: $primary;
  }
  .TodoInputText:focus {
    color: $primary;
  }
  .TodoItem {
    border: 100px;
    border-color: $primary;
    background-color: $grey-light;
  }
  .TodoSelect {
      --background: $grey-light;
      --border-focus-color: $primary;
      --itemHoverBG: $grey-dark;
      --inputColor: $primary;

      --itemColor: $grey-light;
      --itemIsActiveColor: $primary;
      --itemIsActiveBg: $grey-light;
      --borderColor: $primary;
    //   --
  }
</style>
