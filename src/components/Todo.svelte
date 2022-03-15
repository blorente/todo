<script lang="ts">
  import { db } from "../db";
  import { liveQuery } from "dexie";
  import { flip } from "svelte/animate";
  import { fade, fly } from "svelte/transition";

  let tasksToDo = liveQuery(() =>
    db.tasks.where("status").equals("TODO").toArray()
  );

  let newTaskName;
  let newTaskLink;
  let taskInput;
  const addNewTask = () => {
    db.tasks.add({
      name: newTaskName,
      domain: "*",
      link: newTaskLink,
      status: "TODO",
      dateAdded: new Date(Date.now()),
    });
    newTaskName = "";
    newTaskLink = "";
    taskInput.focus();
  };

  const markTaskDone = (task) => {
    db.tasks.update(task, { status: "DONE" });
  };
</script>

<div class="container panel is-dark TodoApp">
  <p class="panel-heading">Tasks</p>
  <div class="panel-block">
    <form class="control" on:submit|preventDefault={addNewTask} >
      <input
        class="input title is-5"
        type="text"
        placeholder="New Task"
        bind:value={newTaskName}
        bind:this={taskInput}
      />
    </form>
    <form class="control" on:submit|preventDefault={addNewTask}>
      <input
        type="text"
        class="input title is-5"
        placeholder="Task Link"
        bind:value={newTaskLink}
        on:submit={addNewTask}
      />
    </form>
  </div>
  <div class="panel-block">
    <p class="control has-icons-left">
      <input class="input" type="text" placeholder="Search" />
      <span class="icon is-left">
        <i class="fas fa-search" aria-hidden="true" />
      </span>
    </p>
  </div>
  {#if $tasksToDo}
    {#each $tasksToDo as task (task.id)}
      <div class="panel-block" animate:flip in:fade out:fly={{ x: 100 }}>
        <input type="checkbox" on:click={() => markTaskDone(task)} />
        <span class="title is-3">
          <a href={task.link} target="_blank" class="link">[Link]</a>
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
  }
</style>
