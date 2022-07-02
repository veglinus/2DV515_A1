1. Find all movies that toby has not seen

2. Get similarity of users who have seen movies that toby havn't watched

3. Don't include users who have similarity score of 0 or below
Pearson: don't include person who has not watched some movies
Euclidean; include all

foreach movie not seen:
	
	Ews = 0;
	
	foreach rating given, calculate ws and add to ews


ws = Similarity * Rating on movie by person
Ews = sum of all weighted scores of movie
Esim = all similarity scores added up

lastly do:
Ews / Esim = to then find a recommended movie, highest score of all movies win





Calculate weighted score for all users on a movie
Sum the weighted score