function shouldRun(
  repositoryName: string, 
  exclude: string[]
): boolean {
  const excludeMatch = exclude.some((repository: string) => {
    return new RegExp("^" + repository.replace(/\*/g, ".*") + "$").test(repositoryName)
  });    

  return !excludeMatch;
}

export default shouldRun;