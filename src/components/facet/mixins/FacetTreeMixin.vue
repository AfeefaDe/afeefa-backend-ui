<script>
export default {
  methods: {
    positionTree (tree, rootX, rootY, diffX, diffY, alternativeRootX) {
      tree.style.left = rootX + diffX + 'px'
      tree.style.top = rootY + diffY + 'px'

      const rect = tree.getBoundingClientRect()

      if (rect.right > window.innerWidth - 20) {
        let diff = rect.right - window.innerWidth + 20
        if (alternativeRootX !== undefined) {
          tree.style.left = alternativeRootX - rect.width + 'px'
        } else {
          tree.style.left = rootX - diff + 'px'
        }
      }

      if (rect.bottom > window.innerHeight - 20) {
        const diff = rect.bottom - window.innerHeight + 20
        tree.style.top = rootY - 10 - diff + 'px'
      }
    }
  }
}
</script>
