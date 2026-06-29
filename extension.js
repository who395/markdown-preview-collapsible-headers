function activate() {
  console.log('[md-collapsible] activated');
  return {
    extendMarkdownIt(md) {
      console.log('[md-collapsible] extendMarkdownIt called');
      md.core.ruler.push('collapsible_headers', function (state) {
        const tokens = state.tokens;
        const newTokens = [];
        const levelStack = [];

        function htmlToken(content) {
          const token = new state.Token('html_block', '', 0);
          token.content = content;
          return token;
        }

        for (const token of tokens) {
          if (token.type === 'heading_open') {
            const level = parseInt(token.tag[1]);
            while (levelStack.length > 0 && levelStack[levelStack.length - 1] >= level) {
              newTokens.push(htmlToken('</div></details>\n'));
              levelStack.pop();
            }
            levelStack.push(level);
            newTokens.push(htmlToken('<details open class="md-section">\n<summary>\n'));
            newTokens.push(token);
          } else if (token.type === 'heading_close') {
            newTokens.push(token);
            newTokens.push(htmlToken('</summary>\n<div class="md-section-body">\n'));
          } else {
            newTokens.push(token);
          }
        }

        while (levelStack.length > 0) {
          newTokens.push(htmlToken('</div></details>\n'));
          levelStack.pop();
        }

        state.tokens = newTokens;
      });
      return md;
    }
  };
}

function deactivate() {}
module.exports = { activate, deactivate };
