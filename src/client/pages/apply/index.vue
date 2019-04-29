<script>
import Vacation from '@/pages/apply/vacation'
import ChangeTime from '@/pages/apply/time'
import Check from '@/pages/apply/check'

export default {
  name: 'apply',

  components: { Vacation, ChangeTime, Check },

  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      selected: {},
      types: [
        {
          name: 'vacation',
          desc: '休暇申請(有休/代休/慶弔/欠勤)'
        },
        {
          name: 'lateIn',
          desc: '遅刻申請'
        },
        {
          name: 'earlyOut',
          desc: '早退申請'
        },
        {
          name: 'earlyIn',
          desc: '早出申請'
        },
        {
          name: 'overWork',
          desc: '残業申請'
        }
      ],
      isChecked: false,
      req: []
    }
  },

  methods: {
    selectType (type) {
      this.selected = type
    },

    init () {
      this.selected = {}
      this.req = []
    },

    toggleChecked () {
      this.isChecked = !this.isChecked
    },

    copy (data) {
      this.req = data
    }
  }
}
</script>

<template lang="html">
  <div class="container apply">
    <template v-if="!selected.name">
      <div class="subtitle">各種申請</div>
      <div class="content">
        <div class="types">
          <button
            v-for="type in types"
            type="button"
            class="button is-medium type"
            @click="selectType(type)">
            {{ type.desc }}
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="subtitle">
        {{ selected.desc }}
      </div>
      <div class="content">
        <Check
          v-if="isChecked"
          :type="selected"
          :req="req"
          :user="user"
          @toggle-checked="toggleChecked"
          @go-top="$emit('go-to', 'timesheet')" />
        <Vacation
          v-else-if="selected.name === 'vacation'"
          :req="req"
          @copy="copy"
          @init="init"
          @toggle-checked="toggleChecked" />
        <ChangeTime
          v-else
          :req="req"
          @copy="copy"
          @init="init"
          @toggle-checked="toggleChecked" />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.types {
  padding: 10px;
  .type {
    width: 100%;
    margin-bottom: 1rem;
    border: solid 1px #2991E1;
    border-radius: .5em;
    &:hover {
      background-color: #2991E1;
      color: #fff;
    }
  }
}
.content {
  margin: 0 1em;
}
</style>
