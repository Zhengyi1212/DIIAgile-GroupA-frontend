# Group A
This is the offical backend repository for Dii booking system of agile course

# Working principle：

## First time to access to repository:
1. git init 
2. git remote add origin url, note that u have a local branch master and remote branch main now
3. git pull origin main (This pull the code from main branch to local master)
4. git branch -m main (Rename the local branch to main for consistency)

## When you start writing code next time, you need to get code from remote main to sync:
1. git pull (This update your local main)
2. resolve conflit by adding or deleting code (hopefullt this does not happens, cuz we work on different modules)

## When u done coding ur work
1. git add .
2. git commit -m "write what u have done here, must write something meaningful here"
3. git push origin main  (note here push to master, cuz master is the working branch)
