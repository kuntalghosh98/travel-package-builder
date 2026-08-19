export const queryKeys = {
  folders: {
    all: ['folders']
  },
  templates: {
    all: ['templates'],
    user: ['templates', 'user']
  },
  packages: {
    all: ['packages'],
    detail: id => ['packages', id]
  }
};
