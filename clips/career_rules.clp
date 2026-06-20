;;; Career Guidance System - CLIPS Knowledge Base
;;; Bowen University - Salami Anjolaoluwa

;;; ==================
;;; SCIENCE TRACK RULES
;;; ==================

(defrule science-medicine
    (track science)
    (activity medicine)
    =>
    (assert (recommendation "Medicine and Surgery"))
)

(defrule science-medicine-skill
    (track science)
    (skill analytical)
    (activity medicine)
    =>
    (assert (recommendation "Pharmacy"))
)

(defrule science-engineering
    (track science)
    (activity engineering)
    =>
    (assert (recommendation "Engineering"))
)

(defrule science-engineering-technical
    (track science)
    (activity engineering)
    (skill technical)
    =>
    (assert (recommendation "Computer Engineering"))
)

(defrule science-agriculture
    (track science)
    (activity agriculture)
    =>
    (assert (recommendation "Agriculture"))
)

(defrule science-agriculture-practical
    (track science)
    (activity agriculture)
    (skill practical)
    =>
    (assert (recommendation "Veterinary Medicine"))
)

(defrule science-research
    (track science)
    (activity research)
    =>
    (assert (recommendation "Biochemistry"))
)

(defrule science-research-analytical
    (track science)
    (activity research)
    (skill analytical)
    =>
    (assert (recommendation "Microbiology"))
)

(defrule science-computing
    (track science)
    (skill technical)
    (activity engineering)
    =>
    (assert (recommendation "Computer Science"))
)

;;; ==================
;;; COMMERCIAL TRACK RULES
;;; ==================

(defrule commercial-accounting
    (track commercial)
    (activity accounting)
    =>
    (assert (recommendation "Accounting"))
)

(defrule commercial-accounting-numerical
    (track commercial)
    (activity accounting)
    (skill numerical)
    =>
    (assert (recommendation "Financial Management"))
)

(defrule commercial-marketing
    (track commercial)
    (activity marketing)
    =>
    (assert (recommendation "Marketing"))
)

(defrule commercial-marketing-communication
    (track commercial)
    (activity marketing)
    (skill communication)
    =>
    (assert (recommendation "Public Relations"))
)

(defrule commercial-finance
    (track commercial)
    (activity finance)
    =>
    (assert (recommendation "Banking and Finance"))
)

(defrule commercial-finance-strategic
    (track commercial)
    (activity finance)
    (skill strategic)
    =>
    (assert (recommendation "Investment Management"))
)

(defrule commercial-business
    (track commercial)
    (activity business)
    =>
    (assert (recommendation "Business Administration"))
)

(defrule commercial-business-leadership
    (track commercial)
    (activity business)
    (skill leadership)
    =>
    (assert (recommendation "Entrepreneurship"))
)

;;; ==================
;;; ARTS TRACK RULES
;;; ==================

(defrule arts-law
    (track arts)
    (activity law)
    =>
    (assert (recommendation "Law"))
)

(defrule arts-law-research
    (track arts)
    (activity law)
    (skill research)
    =>
    (assert (recommendation "International Relations"))
)

(defrule arts-media
    (track arts)
    (activity media)
    =>
    (assert (recommendation "Mass Communication"))
)

(defrule arts-media-creative
    (track arts)
    (activity media)
    (skill creative)
    =>
    (assert (recommendation "Journalism"))
)

(defrule arts-education
    (track arts)
    (activity education)
    =>
    (assert (recommendation "Education"))
)

(defrule arts-education-communication
    (track arts)
    (activity education)
    (skill communication)
    =>
    (assert (recommendation "English Language Education"))
)

(defrule arts-socialwork
    (track arts)
    (activity socialwork)
    =>
    (assert (recommendation "Social Work"))
)

(defrule arts-socialwork-empathy
    (track arts)
    (activity socialwork)
    (skill empathy)
    =>
    (assert (recommendation "Psychology"))
)

;;; ==================
;;; IQ SCORE MODIFIERS
;;; ==================

(defrule high-iq-science
    (track science)
    (iq-score ?score&:(>= ?score 4))
    =>
    (assert (iq-level high))
)

(defrule average-iq-science
    (track science)
    (iq-score ?score&:(< ?score 4))
    =>
    (assert (iq-level average))
)

(defrule high-iq-commercial
    (track commercial)
    (iq-score ?score&:(>= ?score 4))
    =>
    (assert (iq-level high))
)

(defrule high-iq-arts
    (track arts)
    (iq-score ?score&:(>= ?score 4))
    =>
    (assert (iq-level high))
)