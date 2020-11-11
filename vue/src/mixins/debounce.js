const deboucneMixin = {
  data () {
    return {
      debounceHandler: () => {}
    }
  },
  methods: {
    debounce (func, wait, immediate) {
      var timeout
      return () => {
        var context = this
        var args = arguments
        var later = function () {
          timeout = null
          if (!immediate) func.apply(context, args)
        }
        var callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
      }
    }
  }
}

export default deboucneMixin
